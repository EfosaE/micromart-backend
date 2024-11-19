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

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

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
    } else if (
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientValidationError
    ) {
      // Handle Prisma validation errors (e.g., unique constraint violation)
      myResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      myResponseObj.response = {
        message: (exception as PrismaClientKnownRequestError).message,
        code: (exception as PrismaClientKnownRequestError).code, // Prisma error code, useful for debugging
        meta: (exception as PrismaClientKnownRequestError).meta, // Additional meta data for debugging
      };
    } else {
      // Log unexpected errors
      console.error(exception);
    }

    // Log the error for debugging
    this.logger.error(
      JSON.stringify({
        ...myResponseObj,
        exception: exception instanceof Error ? exception.stack : exception,
      }),
      AllExceptionsFilter.name
    );

    // Send response
    response.status(myResponseObj.statusCode).json(myResponseObj);
  }
}
