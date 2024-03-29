import { Service } from 'typedi';
import { DEFAULT_LIMIT, ErrorName, ProductLength, ProductThickness, ProductWidth } from '~const';
import { GetListResponse } from '~interfaces/common';
import { logger } from '~logger';
import AccountService from '~modules/account/service';
import {
  FailedProductCreationAttributes,
  GetProductsQueryParams,
  ProductCreateInput,
  ProductsCreateInput,
  ProductsCreationResponse,
  ProductUpdateInput,
} from '~modules/product/interface';
import { prisma } from '~prisma';
import { getHasMore } from '~utils/response';

import { DeliveryMethod, Prisma, Product } from '@prisma/client';

@Service()
export default class ProductService {
  constructor(private accountService: AccountService) {}

  public async getProductById(id: number): Promise<Product | null> {
    logger.debug('... Looking for product: %o', id);
    return prisma.product.findUnique({
      where: { id },
      include: {
        account: true,
        images: true,
        plates: true,
        stock: true,
        workOrders: {
          orderBy: {
            orderedAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  public async getProduct({
    accountName,
    name,
    thickness,
    length,
    width,
  }: {
    accountName: string;
    name: string;
    thickness: number;
    length: number;
    width: number;
  }): Promise<Product | null> {
    logger.debug(
      '... Looking for product: %o %o %o %o %o',
      accountName,
      name,
      thickness,
      length,
      width,
    );
    return await prisma.product.findFirst({
      where: {
        AND: {
          account: {
            name: accountName,
          },
          name,
          thickness: thickness.toFixed(3),
          length: length.toFixed(2),
          width: width.toFixed(2),
        },
      },
      include: {
        account: true,
        plates: true,
      },
    });
  }

  public async getProducts(query: GetProductsQueryParams): Promise<GetListResponse<Product>> {
    const { offset = 0, limit = DEFAULT_LIMIT } = query;

    const where = this.generateWhereClause(query);

    const [count, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        skip: offset,
        take: limit,
        where,
        include: {
          account: true,
          images: true,
          stock: true,
        },
        orderBy: [
          { account: { name: 'asc' } },
          { name: 'asc' },
          { thickness: 'asc' },
          { length: 'asc' },
          { width: 'asc' },
        ],
      }),
    ]);

    const hasMore = getHasMore({ limit, offset, count });

    return { rows, count, hasMore };
  }

  public async getAllProducts(query: GetProductsQueryParams): Promise<GetListResponse<Product>> {
    const where = this.generateWhereClause(query);

    const rows = await prisma.product.findMany({
      where,
      include: {
        account: true,
        images: true,
        workOrders: true,
        plates: true,
      },
      orderBy: [
        { account: { name: 'asc' } },
        { name: 'asc' },
        { thickness: 'asc' },
        { length: 'asc' },
        { width: 'asc' },
      ],
    });

    return { rows };
  }

  public async createProduct(userInput: ProductCreateInput): Promise<Product | null> {
    try {
      logger.debug(
        '... Creating product: %o %o %o %o',
        userInput.name,
        userInput.thickness,
        userInput.length,
        userInput.width,
      );
      const { account, images, ...productData } = userInput;
      return await prisma.product.create({
        data: {
          ...productData,
          images: {
            create: images as Prisma.ImageCreateWithoutProductInput[],
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createProducts(userInput: ProductsCreateInput[]): Promise<ProductsCreationResponse> {
    let failedList: FailedProductCreationAttributes[] = [];
    let createdCount = 0;

    await Promise.all(
      userInput.map(async (product) => {
        try {
          const { accountName, ...restProduct } = product;
          const account = await this.accountService.getAccountByName(accountName);
          if (!account) {
            throw new Error('Account not found');
          }
          await this.createProduct({ accountId: account.id, ...restProduct });
          createdCount++;
        } catch (error) {
          failedList.push({ ...product, reason: (error as any).message });
        }
      }),
    );

    return { createdCount, failedList };
  }

  public async updateProduct(id: number, userInput: ProductUpdateInput): Promise<Product | null> {
    const productToUpdate = await this.getProductById(id);
    if (!productToUpdate) {
      throw new Error(ErrorName.PRODUCT_NOT_FOUND);
    }

    try {
      const { name } = productToUpdate;
      const { imagesToCreate, images, imageIdsToDelete, updatedAt, ...restUserInput } = userInput;

      logger.debug('... Updating the product %o and its images', name);
      return await prisma.product.update({
        where: { id },
        data: {
          ...restUserInput,
          images: {
            create: imagesToCreate,
            updateMany: images?.map(({ id, productId, ...image }) => ({
              where: { id },
              data: image,
            })),
            deleteMany: imageIdsToDelete?.map((id) => ({ id })),
          },
        },
        include: {
          images: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateDeliveryMethodByAccountId(
    accountId: number,
    userInput: { deliveryMethod: DeliveryMethod },
  ): Promise<number> {
    try {
      const { deliveryMethod } = userInput;

      logger.debug('... Updating the products of account %o', accountId);
      const { count } = await prisma.product.updateMany({
        where: { accountId },
        data: {
          deliveryMethod,
        },
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async deleteProducts(ids: number[]): Promise<number> {
    const { count } = await prisma.product.deleteMany({ where: { id: { in: ids } } });
    return count;
  }

  private generateWhereClause({
    accountName,
    name,
    extColor,
    printColor,
    thickness,
    length,
    width,
  }: GetProductsQueryParams): Prisma.ProductWhereInput {
    return {
      AND: {
        account: {
          name: { contains: accountName, mode: Prisma.QueryMode.insensitive },
        },
        name: { contains: name, mode: Prisma.QueryMode.insensitive },
        extColor: { contains: extColor, mode: Prisma.QueryMode.insensitive },
        OR: [
          {
            printFrontColor: { contains: printColor, mode: Prisma.QueryMode.insensitive },
          },
          {
            printBackColor: { contains: printColor, mode: Prisma.QueryMode.insensitive },
          },
        ],
        thickness: thickness
          ? {
              equals: +thickness,
            }
          : undefined,
        length: length
          ? {
              equals: +length,
            }
          : undefined,
        width: width
          ? {
              equals: +width,
            }
          : undefined,
      },
    };
  }
}
