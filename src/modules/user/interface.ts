import { User, UserRole } from '@prisma/client';

export interface UserWithRole extends User {
  userRole: UserRole;
}

export interface GetUsersQueryParams {
  offset?: number;
  limit?: number;
}
