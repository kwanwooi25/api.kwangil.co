export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

export interface GetListResponse<T> {
  rows: T[];
  count?: number;
  hasMore?: boolean;
}
