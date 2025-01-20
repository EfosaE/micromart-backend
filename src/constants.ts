/* eslint-disable @typescript-eslint/no-require-imports */
import assert = require('assert');

// // Ensure that all required environment variables are defined
assert(process.env.DATABASE_URL, 'DATABASE_URL is not defined');
assert(process.env.JWT_SECRET, 'JWT_SECRET is not defined');
assert(process.env.REFRESH_TOKEN, 'REFRESH_TOKEN is not defined');
assert(process.env.CLIENT_ID, 'CLIENT_ID is not defined');
assert(process.env.CLIENT_SECRET, 'CLIENT_SECRET is not defined');
assert(process.env.REDIRECT_URI, 'REDIRECT_URI is not defined');
assert(process.env.EMAIL_USER, 'EMAIL_USER is not defined');
assert(process.env.EMAIL_PASS, 'EMAIL_PASS is not defined');
assert(process.env.EMAIL_FROM, 'EMAIL_FROM is not defined');
assert(
  process.env.CLOUDINARY_CLOUD_NAME,
  'CLOUDINARY_CLOUD_NAME is not defined'
);
assert(process.env.CLOUDINARY_API_KEY, 'CLOUDINARY_API_KEY is not defined');
assert(
  process.env.CLOUDINARY_API_SECRET,
  'CLOUDINARY_API_SECRET is not defined'
);
assert(process.env.OPTIMIZE_API_KEY, 'OPTIMIZE_API_KEY is not defined');
assert(process.env.NODE_ENV, 'NODE_ENV is not defined');
assert(process.env.TEST_SECRET_KEY, 'TEST_SECRET_KEY is not defined');
assert(process.env.PAYSTACK_BASE_URL, 'PAYSTACK_BASE_URL is not defined');

// Export all environment variables in a centralized object
export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  OPTIMIZE_API_KEY: process.env.OPTIMIZE_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  TEST_SECRET_KEY: process.env.TEST_SECRET_KEY,
  PAYSTACK_BASE_URL: process.env.PAYSTACK_BASE_URL,
};
