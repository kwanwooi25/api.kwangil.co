import { Service } from 'typedi';
import { DEFAULT_LIMIT, ErrorName, ProductLength, ProductThickness, ProductWidth } from '~const';
import { GetListResponse } from '~interfaces/common';
import { logger } from '~logger';
import AccountService from '~modules/account/service';
import {
    FailedProductCreationAttributes, GetProductsQueryParams, ProductCreateInput,
    ProductsCreateInput, ProductsCreationResponse, ProductUpdateInput
} from '~modules/product/interface';
import { prisma } from '~prisma';
import { getHasMore } from '~utils/response';

import { Prisma, Product } from '@prisma/client';

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
    logger.debug('... Looking for product: %o %o %o %o %o', accountName, name, thickness, length, width);
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
        userInput.width
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
          failedList.push({ ...product, reason: error.message as string });
        }
      })
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
      const { imagesToCreate, images, imageIdsToDelete, ...restUserInput } = userInput;

      logger.debug('... Updating the product %o and its images', name);
      return await prisma.product.update({
        where: { id },
        data: {
          ...restUserInput,
          images: {
            create: imagesToCreate,
            updateMany: images?.map(({ id, productId, ...image }) => ({ where: { id }, data: image })),
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

  public async deleteProducts(ids: number[]): Promise<number> {
    const { count } = await prisma.product.deleteMany({ where: { id: { in: ids } } });
    return count;
  }

  private generateWhereClause(query: GetProductsQueryParams): Prisma.ProductWhereInput {
    const [minThickness, maxThickness] = query.thickness || [ProductThickness.MIN, ProductThickness.MAX];
    const [minLength, maxLength] = query.length || [ProductLength.MIN, ProductLength.MAX];
    const [minWidth, maxWidth] = query.width || [ProductWidth.MIN, ProductWidth.MAX];

    return {
      AND: {
        account: {
          name: { contains: query.accountName, mode: Prisma.QueryMode.insensitive },
        },
        name: { contains: query.name, mode: Prisma.QueryMode.insensitive },
        extColor: { contains: query.extColor, mode: Prisma.QueryMode.insensitive },
        OR: [
          {
            printFrontColor: { contains: query.printColor, mode: Prisma.QueryMode.insensitive },
          },
          {
            printBackColor: { contains: query.printColor, mode: Prisma.QueryMode.insensitive },
          },
        ],
        thickness: {
          gte: minThickness.toFixed(3),
          lte: maxThickness.toFixed(3),
        },
        length: {
          gte: minLength.toFixed(2),
          lte: maxLength.toFixed(2),
        },
        width: {
          gte: minWidth.toFixed(2),
          lte: maxWidth.toFixed(2),
        },
      },
    };
  }
}
