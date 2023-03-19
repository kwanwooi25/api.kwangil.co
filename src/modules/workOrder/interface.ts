import { PrintSide, Prisma, WorkOrder, WorkOrderStatus } from '@prisma/client';

export interface GetWorkOrdersQueryParams {
  offset?: number;
  limit?: number;
  orderedAt?: (Date | string)[];
  accountName?: string;
  productName?: string;
  thickness?: string | number;
  length?: string | number;
  width?: string | number;
  includeCompleted?: boolean;
}

export interface GetWorkOrdersByDeadlineQueryParams {
  deadline?: Date | string;
}

export interface GetWorkOrderCountQueryParams {
  orderedAt?: (Date | string)[];
}

export interface WorkOrderCreateInput extends Omit<Prisma.WorkOrderUncheckedCreateInput, 'id'> {
  id?: string;
}

export interface WorkOrdersCreateInput
  extends Omit<Prisma.WorkOrderUncheckedCreateInput, 'accountId' | 'productId'> {
  accountName: string;
  productName: string;
  thickness: number;
  length: number;
  width: number;
}

export interface WorkOrderUpdateInput extends Omit<Prisma.WorkOrderUpdateInput, 'product'> {}

export interface WorkOrderCompleteInput {
  id: string;
  completedAt: Date | string | null;
  completedQuantity: number;
  cuttingMachine: string;
  workOrderStatus: WorkOrderStatus;
  productId: number;
}

export interface FailedWorkOrderCreationAttributes extends WorkOrdersCreateInput {
  reason: string;
}

export interface WorkOrdersCreationResponse {
  createdCount: number;
  failedList: FailedWorkOrderCreationAttributes[];
}

export interface WorkOrdersByDeadline {
  overdue: WorkOrder[];
  imminent: WorkOrder[];
}

export interface WorkOrderCount {
  byStatus: { [key in WorkOrderStatus]: number };
  byPrintSide: { [key in PrintSide]: number };
}
