import { Account, Prisma } from '@prisma/client';
import {
  AccountUpdateInput,
  AccountsCreationResponse,
  FailedAccountCreationAttributes,
  GetAccountsQueryParams,
} from './interface';
import { DEFAULT_LIMIT, ErrorName } from '~const';

import { GetListResponse } from '~interfaces/common';
import { Service } from 'typedi';
import { getHasMore } from '~utils/response';
import { logger } from '~logger';
import { prisma } from '~prisma';

@Service()
export default class AccountService {
  public async getAccountById(id: number): Promise<Account | null> {
    logger.debug('... Looking for account: %o', id);
    return await prisma.account.findUnique({
      where: { id },
      include: {
        contacts: {
          orderBy: [{ isBase: 'desc' }, { id: 'asc' }],
        },
      },
    });
  }

  public async getAccountByName(name: string): Promise<Account | null> {
    logger.debug('... Looking for account: %o', name);
    return await prisma.account.findUnique({ where: { name } });
  }

  public async getAccounts(query: GetAccountsQueryParams): Promise<GetListResponse<Account>> {
    const { offset = 0, limit = DEFAULT_LIMIT, searchText = '', withContacts = false } = query;
    const where = { name: { contains: searchText, mode: Prisma.QueryMode.insensitive } };

    const [count, rows] = await Promise.all([
      prisma.account.count({ where }),
      prisma.account.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          name: 'asc',
        },
        include: {
          contacts: withContacts && {
            orderBy: [{ isBase: 'desc' }, { id: 'asc' }],
          },
        },
      }),
    ]);

    const hasMore = getHasMore({ limit, offset, count });

    return { rows, count, hasMore };
  }

  public async getAllAccounts(query: GetAccountsQueryParams): Promise<GetListResponse<Account>> {
    const { searchText = '', withContacts = false } = query;
    const rows = await prisma.account.findMany({
      where: {
        name: {
          contains: searchText,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      orderBy: { name: 'asc' },
      include: {
        contacts: withContacts && {
          orderBy: [{ isBase: 'desc' }, { id: 'asc' }],
        },
      },
    });

    return { rows };
  }

  public async createAccount(userInput: Prisma.AccountCreateInput): Promise<Account | null> {
    try {
      const existingAccount = await this.getAccountByName(userInput.name);
      if (existingAccount) {
        throw new Error(ErrorName.ACCOUNT_EXISTS);
      }

      logger.debug('... Creating account: %o', userInput.name);
      const { contacts, ...accountData } = userInput;
      return await prisma.account.create({
        data: {
          ...accountData,
          contacts: {
            create: contacts as Prisma.ContactCreateWithoutAccountInput[],
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createAccounts(userInput: Prisma.AccountCreateInput[]): Promise<AccountsCreationResponse> {
    let failedList: FailedAccountCreationAttributes[] = [];
    let createdCount = 0;

    await Promise.all(
      userInput.map(async (account) => {
        try {
          await this.createAccount(account);
          createdCount++;
        } catch (error) {
          failedList.push({ ...account, reason: error.message as string });
        }
      })
    );

    return { createdCount, failedList };
  }

  public async updateAccount(id: number, userInput: AccountUpdateInput): Promise<Account> {
    const accountToUpdate = await this.getAccountById(id);
    if (!accountToUpdate) {
      throw new Error(ErrorName.ACCOUNT_NOT_FOUND);
    }

    const { contactsToCreate, contacts, contactIdsToDelete, ...accountInput } = userInput;

    logger.debug('... Updating the account %o and its contacts', accountToUpdate.name);
    return await prisma.account.update({
      where: { id },
      data: {
        ...accountInput,
        contacts: {
          create: contactsToCreate,
          updateMany: contacts?.map(({ id, accountId, ...contact }) => ({ where: { id }, data: contact })),
          deleteMany: contactIdsToDelete?.map((id) => ({ id })),
        },
      },
      include: {
        contacts: true,
      },
    });
  }

  public async deleteAccounts(ids: number[]): Promise<number> {
    const { count } = await prisma.account.deleteMany({ where: { id: { in: ids } } });
    return count;
  }
}
