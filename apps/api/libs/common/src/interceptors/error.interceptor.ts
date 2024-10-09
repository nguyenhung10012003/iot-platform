import {
  BadGatewayException,
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorType } from '../types';

interface ErrorHandler {
  handle(error: Error): Observable<never>;
}

/**
 * Http error handler
 * @class HttpErrorHandler handles all http errors
 * @method handle Handle http error
 */
class HttpErrorHandler implements ErrorHandler {
  handle(error: Error) {
    return throwError(() => error);
  }
}

/**
 * Prisma error handler
 * @class PrismaErrorHandler handles all prisma errors
 * @method handle Handle prisma error
 */
class PrismaErrorHandler implements ErrorHandler {
  handle(error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return throwError(
            () =>
              new ConflictException({
                error: ErrorType.DUPLICATE,
                message: 'Duplicate entry',
              }),
          );
        case 'P2003':
          return throwError(
            () =>
              new ConflictException({
                message: error.message || 'Foreign key constraint failed',
              }),
          );
        case 'P2025':
          return throwError(
            () =>
              new NotFoundException({
                error: ErrorType.NOTFOUND,
                message: error.message || 'Not found',
              }),
          );
        default:
          return throwError(() => new BadGatewayException('Prisma error'));
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return throwError(
        () =>
          new BadGatewayException({
            error: ErrorType.UNKNOWN,
            message: error.message,
          }),
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      return throwError(
        () =>
          new BadRequestException({
            error: ErrorType.INVALID,
            message: "Invalid query data or query doesn't exist",
          }),
      );
    }
    return throwError(() => new BadGatewayException());
  }
}

class DefaultErrorHandler implements ErrorHandler {
  handle(error: Error) {
    return throwError(() => new BadGatewayException(error.message));
  }
}

/**
 * Error handler factory
 * @class ErrorHandlerFactory
 * @method getHandler Get error handler based on error type
 */
class ErrorHandlerFactory {
  static getHandler(error: Error) {
    console.log(error);
    if (error instanceof HttpException) {
      return new HttpErrorHandler();
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return new PrismaErrorHandler();
    } else {
      return new DefaultErrorHandler();
    }
  }
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: Error) => {
        const handler = ErrorHandlerFactory.getHandler(error);
        return handler.handle(error);
      }),
    );
  }
}
