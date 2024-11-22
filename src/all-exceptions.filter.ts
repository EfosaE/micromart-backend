import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { MyLoggerService } from './logger/logger.service';
import { handlePrismaError } from './utils/utils';

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);
  // private readonly configService = new ConfigService();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const environment = process.env.NODE_ENV;

    const myResponseObj: MyResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      // Handle HTTP exceptions (e.g., class-validator errors)
      myResponseObj.statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();

      myResponseObj.response =
        typeof errorResponse === 'string'
          ? { message: errorResponse }
          : errorResponse;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      if (environment === 'development') {
        myResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        myResponseObj.response = {
          message: exception.message, // Prisma error message
          code: exception.code, // Prisma error code (e.g., P2002)
          meta: exception.meta, // Additional metadata for debugging
        };
      } else {
        const error = handlePrismaError(exception);
        myResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        myResponseObj.response = {
          message: error.message, // Prisma error message
          code: exception.code, // Prisma error code (e.g., P2002)
          meta: exception.meta, // Additional metadata for debugging
        };
      }
    } else if (exception instanceof PrismaClientValidationError) {
      // Handle Prisma validation errors
      myResponseObj.statusCode = HttpStatus.BAD_REQUEST; // 400 Bad Request
      myResponseObj.response = {
        message: exception.message, // Validation error message
      };
    } else {
      // Log unexpected errors
      console.error(exception);
    }

    // Log the error for debugging
    this.logger.error(
      JSON.stringify({
        ...myResponseObj,

        // for now dont log the stack trace
        // exception: exception instanceof Error ? exception.stack : exception,
      }),
      AllExceptionsFilter.name
    );

    // Send response
    response.status(myResponseObj.statusCode).json(myResponseObj);
  }
}
