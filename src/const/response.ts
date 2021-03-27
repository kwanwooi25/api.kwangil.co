import { ErrorResponse } from '~interfaces/common';

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorName {
  USER_EXISTS = 'USER_EXISTS',
  UNABLE_TO_CREATE_USER = 'UNABLE_TO_CREATE_USER',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ACCOUNT_EXISTS = 'ACCOUNT_EXISTS',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  CONTACT_NOT_FOUND = 'CONTACT_NOT_FOUND',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PLATE_NOT_FOUND = 'PLATE_NOT_FOUND',
  WORK_ORDER_NOT_FOUND = 'WORK_ORDER_NOT_FOUND',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export enum ErrorType {
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Not Found',
  CONFLICT = 'Conflict',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export enum ErrorMessage {
  USER_EXISTS = 'User already exists',
  UNABLE_TO_CREATE_USER = 'Unable to create user',
  USER_NOT_FOUND = 'User not found',
  ACCOUNT_EXISTS = 'Account already exists',
  ACCOUNT_NOT_FOUND = 'Account not found',
  CONTACT_NOT_FOUND = 'Contact not found',
  PRODUCT_NOT_FOUND = 'Product not found',
  PLATE_NOT_FOUND = 'Plate not found',
  WORK_ORDER_NOT_FOUND = 'WorkOrder not found',
  WRONG_PASSWORD = 'Wrong password',
  UNAUTHORIZED = 'Unauthorized',
  TOKEN_INVALID = 'Token invalid',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export const DEFAULT_ERROR = 'INTERNAL_SERVER_ERROR';

export const ERROR_RESPONSE: { [key: string]: ErrorResponse } = {
  [ErrorName.USER_EXISTS]: {
    statusCode: HttpStatus.CONFLICT,
    error: ErrorType.CONFLICT,
    message: ErrorMessage.USER_EXISTS,
  },
  [ErrorName.UNABLE_TO_CREATE_USER]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    error: ErrorType.INTERNAL_SERVER_ERROR,
    message: ErrorMessage.UNABLE_TO_CREATE_USER,
  },
  [ErrorName.USER_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: ErrorType.NOT_FOUND,
    message: ErrorMessage.USER_NOT_FOUND,
  },
  [ErrorName.ACCOUNT_EXISTS]: {
    statusCode: HttpStatus.CONFLICT,
    error: ErrorType.CONFLICT,
    message: ErrorMessage.ACCOUNT_EXISTS,
  },
  [ErrorName.ACCOUNT_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: ErrorType.NOT_FOUND,
    message: ErrorMessage.ACCOUNT_NOT_FOUND,
  },
  [ErrorName.CONTACT_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: ErrorType.NOT_FOUND,
    message: ErrorMessage.CONTACT_NOT_FOUND,
  },
  [ErrorName.PRODUCT_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: ErrorType.NOT_FOUND,
    message: ErrorMessage.PRODUCT_NOT_FOUND,
  },
  [ErrorName.PLATE_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: ErrorType.NOT_FOUND,
    message: ErrorMessage.PLATE_NOT_FOUND,
  },
  [ErrorName.WORK_ORDER_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: ErrorType.NOT_FOUND,
    message: ErrorMessage.WORK_ORDER_NOT_FOUND,
  },
  [ErrorName.WRONG_PASSWORD]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: ErrorType.BAD_REQUEST,
    message: ErrorMessage.WRONG_PASSWORD,
  },
  [ErrorName.UNAUTHORIZED]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    error: ErrorType.UNAUTHORIZED,
    message: ErrorMessage.UNAUTHORIZED,
  },
  [ErrorName.TOKEN_INVALID]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    error: ErrorType.UNAUTHORIZED,
    message: ErrorMessage.TOKEN_INVALID,
  },
  [ErrorName.INTERNAL_SERVER_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    error: ErrorType.INTERNAL_SERVER_ERROR,
    message: ErrorMessage.INTERNAL_SERVER_ERROR,
  },
};
