import { DeliveryMethod } from '@prisma/client';

export interface GetDeliveriesQueryParams {
  offset?: number;
  limit?: number;
  date?: Date | string;
  method?: DeliveryMethod;
}
