import { UserWithRole } from '~modules/user/interface';

import { User } from '@prisma/client';

export {};

declare global {
  namespace Express {
    interface Request {
      currentUserId?: number | null;
      currentUser?: UserWithRole | null;
    }
  }
}
