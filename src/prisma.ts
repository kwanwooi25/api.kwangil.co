import { Container } from 'typedi';
import { DEFAULT_PERMISSIONS } from '~const';
import { logger } from '~logger';
import { SignUpInput } from '~modules/auth/interface';
import UserService from '~modules/user/service';

import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const createDefaultUserRoles = async () => {
  const userRoles: Prisma.UserRoleCreateInput[] = [
    { name: '최고관리자', permissions: DEFAULT_PERMISSIONS.ADMIN },
    { name: '관리자', permissions: DEFAULT_PERMISSIONS.MANAGER },
    { name: '사용자', permissions: DEFAULT_PERMISSIONS.USER },
  ];
  const createdCount = await Container.get(UserService).createUserRoles(userRoles);
  logger.info('>> Default User Roles created: %o', createdCount);
};

const createAdminUser = async () => {
  const adminUser: SignUpInput = {
    name: '정관우',
    email: 'kwanwoo.jeong@gmail.com',
    password: 'rhksnsla12',
    userRoleId: 1,
  };
  const user = await Container.get(UserService).createUser(adminUser);
  logger.info('>> Seed User created: %o %o', user.id, user.name);
};

export const injectSeedData = async () => {
  const userService = Container.get(UserService);
  const userRolesCount = await userService.getUserRolesCount();
  const usersCount = await userService.getUsersCount();
  !userRolesCount && (await createDefaultUserRoles());
  !usersCount && (await createAdminUser());
};
