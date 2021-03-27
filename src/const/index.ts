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
