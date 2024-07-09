import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus, NotFoundException
} from '@nestjs/common';
import { Request, Response } from 'express';


type ErrorResponseType = {
  errorsMessages: ErrorMessageType[]
}
export type ErrorMessageType = {
  field: string
  message: string
}

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse: ErrorResponseType = {
        errorsMessages: []
      };
      const responseBody: any = exception.getResponse();
      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach(
          (e: { field: string; message: string }) => {
            errorsResponse.errorsMessages.push(e);
          }
        );
      } else {
        errorsResponse.errorsMessages.push(responseBody);
      }
      console.log(errorsResponse);
      response.status(status).json(errorsResponse);
    } else {
      response.sendStatus(status)
        .json({
          statusCode: status,
          timestampt: new Date().toISOString(),
          path: request.url
        });
    }
  }
}
