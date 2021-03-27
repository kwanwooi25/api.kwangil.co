import { Prisma } from '@prisma/client';

export interface GetWorkOrdersQueryParams {
  offset?: number;
  limit?: number;
  orderedAt?: (Date | string)[];
  accountName?: string;
  productName?: string;
  includeCompleted?: boolean;
}

export interface WorkOrderCreateInput extends Omit<Prisma.WorkOrderUncheckedCreateInput, 'id'> {
  id?: string;
}

export interface WorkOrdersCreateInput extends Omit<Prisma.WorkOrderUncheckedCreateInput, 'accountId' | 'productId'> {
  accountName: string;
  productName: string;
  thickness: number;
  length: number;
  width: number;
}

export interface WorkOrderUpdateInput extends Omit<Prisma.WorkOrderUpdateInput, 'product'> {}

export interface FailedWorkOrderCreationAttributes extends WorkOrdersCreateInput {
  reason: string;
}

export interface WorkOrdersCreationResponse {
  createdCount: number;
  failedList: FailedWorkOrderCreationAttributes[];
}
