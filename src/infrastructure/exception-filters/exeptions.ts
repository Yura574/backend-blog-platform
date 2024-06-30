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

@Catch(NotFoundException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
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
      response.sendStatus(status)
      //если необходимо настроить тело ответа
      //   .json({
      //   statusCode: status,
      //   timestampt: new Date().toISOString(),
      //   path: request.url,
      // });
    }
  }
}
