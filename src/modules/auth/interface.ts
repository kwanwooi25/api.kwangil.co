import { Prisma, User } from '@prisma/client';

export interface SignUpInput extends Prisma.UserUncheckedCreateInput {
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  salt: string;
}

export interface LoginResult {
  user: User;
  token: string;
}
