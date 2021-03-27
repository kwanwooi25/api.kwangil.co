import { Dialect } from 'sequelize';

export interface DatabaseOptions {
  dialect: Dialect;
  host: string;
  port: string | number;
  username: string;
  password: string;
  database: string;
  sync: boolean;
}

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
