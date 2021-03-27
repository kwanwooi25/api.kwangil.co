import { Image, Prisma } from '@prisma/client';

export interface GetProductsQueryParams {
  offset?: number;
  limit?: number;
  accountName?: string;
  name?: string;
  thickness?: number[];
  length?: number[];
  width?: number[];
  extColor?: string;
  printColor?: string;
}

export interface ProductCreateInput extends Prisma.ProductCreateWithoutPlatesInput {
  accountId: number;
}

export interface ProductsCreateInput extends Prisma.ProductCreateWithoutPlatesInput {
  accountName: string;
}

export interface FailedProductCreationAttributes extends Prisma.ProductCreateWithoutPlatesInput {
  reason: string;
}

export interface ProductsCreationResponse {
  createdCount: number;
  failedList: FailedProductCreationAttributes[];
}

export interface ProductUpdateInput extends Omit<Prisma.ProductUpdateInput, 'images'> {
  imagesToCreate: Prisma.ImageCreateWithoutProductInput[];
  images: Image[];
  imageIdsToDelete: number[];
}
