import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus, NotFoundException
} from '@nestjs/common';
import { Request, Response } from 'express';

// export class ForbiddenException extends HttpException {
//   constructor() {
//     super('Forbidden', HttpStatus.FORBIDDEN);
//   }
// }

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse: {
        errorsMessages: { field: string; message: string }[];
      } = {
        errorsMessages: []
      };
      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        // Если responseBody.message является массивом, обработайте его элементы
        responseBody.message.forEach((e: { message: string; field: string }) => {
          errorsResponse.errorsMessages.push({ field: e.field, message: e.message });
        });
      } else if (typeof responseBody.message === 'string') {
        // Если responseBody.message является строкой, добавьте её напрямую
        errorsResponse.errorsMessages.push({ field: '', message: responseBody.message });
      } else {
        // В остальных случаях добавьте responseBody напрямую
        errorsResponse.errorsMessages.push(responseBody);
      }

      response.status(status).json(errorsResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}