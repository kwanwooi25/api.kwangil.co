import { Prisma, Product } from '@prisma/client';

export interface GetPlatesQueryParams {
  offset?: number;
  limit?: number;
  id?: number | string;
  round?: number[];
  length?: number[];
  name?: string;
  accountName?: string;
  productName?: string;
}

export interface PlateCreateInput extends Omit<Prisma.PlateCreateInput, 'products'> {
  products: Product[];
}

export interface PlateUpdateInput extends Omit<Prisma.PlateUpdateInput, 'products'> {
  products: Product[];
  productsToDisconnect: Product[];
}
