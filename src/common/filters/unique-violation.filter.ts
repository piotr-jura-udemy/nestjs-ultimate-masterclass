import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  // HttpStatus,
  ConflictException,
} from '@nestjs/common';
// import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class UniqueViolationFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    // const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();

    // PostgreSQL unique_violation error code
    if ((exception as any).code === '23505') {
      const detail = exception.message.match(/Key \((.*?)\)=/)?.[1] ?? 'field';

      // return response.status(HttpStatus.CONFLICT).json({
      //   statusCode: HttpStatus.CONFLICT,
      //   message: `${detail} already exists`,
      //   error: 'Conflict',
      // });
      throw new ConflictException(detail);
    }

    // Re-throw other database errors
    throw exception;
  }
}
