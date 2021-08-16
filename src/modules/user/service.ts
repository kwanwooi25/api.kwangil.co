import { genSaltSync, hashSync } from 'bcrypt';
import { Service } from 'typedi';
import { DEFAULT_LIMIT, ErrorName, SALT_ROUNDS } from '~const';
import { GetListResponse } from '~interfaces/common';
import { logger } from '~logger';
import { SignUpInput } from '~modules/auth/interface';
import { prisma } from '~prisma';
import { getHasMore } from '~utils/response';

import { Prisma, User, UserRole } from '@prisma/client';

import { GetUsersQueryParams, UserWithRole } from './interface';

@Service()
export default class UserService {
  public async getUsersCount(): Promise<number> {
    return await prisma.user.count();
  }

  public async getUsers(query: GetUsersQueryParams): Promise<GetListResponse<UserWithRole>> {
    const { offset = 0, limit = DEFAULT_LIMIT } = query;
    const [count, rows] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          name: 'asc',
        },
        include: {
          userRole: true,
        },
      }),
    ]);

    const hasMore = getHasMore({ limit, offset, count });

    return { rows, count, hasMore };
  }

  public async getUserById(id: number): Promise<UserWithRole | null> {
    logger.debug('... Looking for user: %o', id);
    return await prisma.user.findUnique({ where: { id }, include: { userRole: true } });
  }

  public async getUserByEmail(email: string): Promise<UserWithRole | null> {
    logger.debug('... Looking for user: %o', email);
    return await prisma.user.findUnique({ where: { email }, include: { userRole: true } });
  }

  public async getUserRolesCount(): Promise<number> {
    return await prisma.userRole.count();
  }

  public async createUserRoles(userRolesToCreate: Prisma.UserRoleCreateInput[]): Promise<number> {
    const { count } = await prisma.userRole.createMany({ data: userRolesToCreate });
    return count;
  }

  public async createUser(userInput: SignUpInput): Promise<User> {
    if (await this.getUserByEmail(userInput.email)) {
      throw new Error(ErrorName.USER_EXISTS);
    }

    try {
      logger.debug('... Creating User record for %o', userInput.email);
      const { password, ...userData } = userInput;
      const userRole = (await prisma.userRole.findFirst({ where: { isDefault: true } })) as UserRole;
      return await prisma.user.create({
        data: { userRoleId: userRole?.id, ...userData, login: { create: { ...this.hashPassword(password) } } },
      });
    } catch (error) {
      throw new Error(ErrorName.UNABLE_TO_CREATE_USER);
    }
  }

  public async updateUser(id: number, userInput: Prisma.UserUpdateWithoutLoginInput): Promise<UserWithRole> {
    const userToUpdate = await this.getUserById(id);
    if (!userToUpdate) {
      throw new Error(ErrorName.USER_NOT_FOUND);
    }

    logger.debug('... Updating the user %o (%o)', userToUpdate.name, userToUpdate.email);
    const { userRole, ...data } = userInput;
    return await prisma.user.update({
      where: { id },
      data,
      include: {
        userRole: true,
      },
    });
  }

  private hashPassword(password: string) {
    const salt = genSaltSync(SALT_ROUNDS);
    const hashedPassword = hashSync(password, salt);
    return { password: hashedPassword, salt };
  }
}
