import { Container } from 'typedi';
import { PrismaClient, UserRole } from '@prisma/client';
import { logger } from '~logger';
import { SignUpInput } from '~modules/auth/interface';
import UserService from '~modules/user/service';

export const prisma = new PrismaClient();

const createAdminUser = async () => {
  const adminUser: SignUpInput = {
    name: '정관우',
    email: 'kwanwoo.jeong@gmail.com',
    password: 'rhkddlf132',
    role: UserRole.ADMIN,
  };
  const user = await Container.get(UserService).createUser(adminUser);
  logger.info('>> Seed User created: %o %o', user.id, user.name);
};

export const injectSeedData = async () => {
  const usersCount = await Container.get(UserService).getUsersCount();
  !usersCount && (await createAdminUser());
};
