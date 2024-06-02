import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// export class ForbiddenException extends HttpException {
//   constructor() {
//     super('Forbidden', HttpStatus.FORBIDDEN);
//   }
// }

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log(status);
    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse: {
        errorsMessages: { field: string; message: string }[];
      } = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();
      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach(
          (e: { field: string; message: string }) => {
            errorsResponse.errorsMessages.push(e);
          },
        );
      } else {
        errorsResponse.errorsMessages.push(responseBody.message);
      }
      response.status(status).json(errorsResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestampt: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
