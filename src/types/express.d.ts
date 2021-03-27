import { User } from '@prisma/client';

export {};

declare global {
  namespace Express {
    interface Request {
      currentUserId?: number | null;
      currentUser?: User | null;
    }
  }
}
