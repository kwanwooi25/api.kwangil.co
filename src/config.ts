import { config } from 'dotenv';

const DEFAULT_CONFIG = {
  PORT: 5000,

  JWT_SECRET: 'zipifyjwtsecret',
  JWT_EXPIRES_IN: '1d',

  LOG_LEVEL: 'silly',
};

// Set NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Throw error if .env file not found
if (!config()) {
  throw new Error(':::Cannot find .env file:::');
}

export const isDev = process.env.NODE_ENV === 'development';
export const port = process.env.PORT || DEFAULT_CONFIG.PORT;

export const jwtConfig = {
  secret: process.env.JWT_SECRET || DEFAULT_CONFIG.JWT_SECRET,
  expireIn: process.env.JWT_EXPIRES_IN || DEFAULT_CONFIG.JWT_EXPIRES_IN,
};

export const loggerConfig = {
  level: process.env.LOG_LEVEL || DEFAULT_CONFIG.LOG_LEVEL,
};

export default {
  isDev,
  port,
  jwtConfig,
  loggerConfig,
};
