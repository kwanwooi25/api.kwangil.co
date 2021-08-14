import { Permissions } from '@prisma/client';

export * from './response';

export const SALT_ROUNDS = 10;

export const DATE_FORMAT = 'yyyy-MM-dd';

export const DEFAULT_LIMIT = 50;

export enum ProductThickness {
  MIN = 0.05,
  MAX = 0.13,
}

export enum ProductLength {
  MIN = 6,
  MAX = 100,
}

export enum ProductWidth {
  MIN = 5,
  MAX = 80,
}

export enum PlateRound {
  MIN = 300,
  MAX = 600,
}

export enum PlateLength {
  MIN = 300,
  MAX = 800,
}

export const DEFAULT_PERMISSIONS = {
  ADMIN: [...Object.values(Permissions)],
  MANAGER: [
    Permissions.ACCOUNT_READ,
    Permissions.ACCOUNT_CREATE,
    Permissions.ACCOUNT_UPDATE,
    Permissions.ACCOUNT_DELETE,
    Permissions.PRODUCT_READ,
    Permissions.PRODUCT_CREATE,
    Permissions.PRODUCT_UPDATE,
    Permissions.PRODUCT_DELETE,
    Permissions.PLATE_READ,
    Permissions.PLATE_CREATE,
    Permissions.PLATE_UPDATE,
    Permissions.PLATE_DELETE,
    Permissions.WORK_ORDER_READ,
    Permissions.WORK_ORDER_CREATE,
    Permissions.WORK_ORDER_UPDATE,
    Permissions.WORK_ORDER_DELETE,
    Permissions.DELIVERY_READ,
    Permissions.DELIVERY_CREATE,
    Permissions.DELIVERY_UPDATE,
    Permissions.DELIVERY_DELETE,
  ],
  USER: [Permissions.PRODUCT_READ, Permissions.PLATE_READ, Permissions.WORK_ORDER_READ, Permissions.DELIVERY_READ],
};
