import { Service } from 'typedi';
import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcrypt';
import { User } from '@prisma/client';
import { jwtConfig } from '~config';
import { ErrorName } from '~const';
import { prisma } from '~prisma';
import { logger } from '~logger';
import UserService from '~modules/user/service';
import { LoginInput, LoginResult, SignUpInput } from './interface';

@Service()
export default class AuthService {
  constructor(private userService: UserService) {}

  public async signUp(userInput: SignUpInput): Promise<LoginResult> {
    const user = await this.userService.createUser(userInput);
    const token = this.generateToken(user);
    return { user, token };
  }

  public async login({ email, password }: LoginInput): Promise<LoginResult> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error(ErrorName.USER_NOT_FOUND);
    }

    logger.debug('... Checking password for %o', email);
    const login = await prisma.login.findUnique({ where: { userId: user.id } });
    if (!login || !compareSync(password, login.password)) {
      throw new Error(ErrorName.WRONG_PASSWORD);
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken({ id, email }: User) {
    logger.debug('... Generating JWT for %o', email);
    return sign({ id, email }, jwtConfig.secret, { expiresIn: jwtConfig.expireIn });
  }
}
