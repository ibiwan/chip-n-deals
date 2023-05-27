import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
// extends BaseExceptionFilter
export class AllExceptionsFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  catch(exception: unknown, host: ArgumentsHost): void {
    console.log('FILTER HANDLER', { exception, host });

    // super.catch(exception, host);
    return;

    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    // const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? (exception as HttpException).getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      // path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    // httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
