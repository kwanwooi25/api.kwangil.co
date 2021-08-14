import { genSaltSync, hashSync } from 'bcrypt';
import { Service } from 'typedi';
import { ErrorName, SALT_ROUNDS } from '~const';
import { logger } from '~logger';
import { SignUpInput } from '~modules/auth/interface';
import { prisma } from '~prisma';

import { Prisma, User } from '@prisma/client';

@Service()
export default class UserService {
  public async getUsersCount(): Promise<number> {
    return await prisma.user.count();
  }

  public async getUserById(id: number): Promise<User | null> {
    logger.debug('... Looking for user: %o', id);
    return await prisma.user.findUnique({ where: { id }, include: { userRole: true } });
  }

  public async getUserByEmail(email: string): Promise<User | null> {
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
      return await prisma.user.create({
        data: { ...userData, login: { create: { ...this.hashPassword(password) } } },
      });
    } catch (error) {
      throw new Error(ErrorName.UNABLE_TO_CREATE_USER);
    }
  }

  private hashPassword(password: string) {
    const salt = genSaltSync(SALT_ROUNDS);
    const hashedPassword = hashSync(password, salt);
    return { password: hashedPassword, salt };
  }
}
