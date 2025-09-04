import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';


type ErrorResponseType = {
  errorsMessages: ErrorMessageType[]
}
export type ErrorMessageType = {
  message: string
  field: string
}

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log('exception', status);
    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse: ErrorResponseType = {
        errorsMessages: []
      };
      const responseBody: any = exception.getResponse();
      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach(
          (e: { message: string; field: string }) => {
            errorsResponse.errorsMessages.push(e);
          }
        );
      } else {
        errorsResponse.errorsMessages.push(responseBody);
      }
      response.status(status).json(errorsResponse);
    }
    else if(status === HttpStatus.FORBIDDEN){

      const responseBody: any = exception.getResponse();

      response.status(status).json(responseBody);
    }
    else if(status === HttpStatus.TOO_MANY_REQUESTS){

      const responseBody: any = exception.getResponse();

      response.status(status).json(responseBody);
    }
    else if(status === HttpStatus.UNAUTHORIZED){

      const responseBody: any = exception.getResponse();

      response.status(status).json(responseBody);
    }
    else if(status === HttpStatus.NOT_FOUND){

      const responseBody: any = exception.getResponse();

      response.status(status).json(responseBody);
    }else {
      console.log(status);
      response.sendStatus(status)
        .json({
          statusCode: status,
          timestampt: new Date().toISOString(),
          path: request.url
        });
    }
  }
}
