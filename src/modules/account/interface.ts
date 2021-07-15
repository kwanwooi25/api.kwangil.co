import { Contact, Prisma } from '@prisma/client';

export interface AccountUpdateInput extends Omit<Prisma.AccountUpdateInput, 'contacts'> {
  contactsToCreate?: Prisma.ContactCreateWithoutAccountInput[];
  contacts?: Contact[];
  contactIdsToDelete?: number[];
}

export interface GetAccountsQueryParams {
  offset?: number;
  limit?: number;
  accountName?: string;
  withContacts?: boolean;
}

export interface FailedAccountCreationAttributes extends Prisma.AccountCreateInput {
  reason: string;
}

export interface AccountsCreationResponse {
  createdCount: number;
  failedList: FailedAccountCreationAttributes[];
}
