import { BadRequestException, HttpException, INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../infrastructure/guards/auth.guard';
import { ErrorMessageType, HttpExceptionsFilter } from '../infrastructure/exception-filters/exeptions';
import { Request, Response } from 'express';

const API_PREFIX = '/api';

export const applyAppSetting = (app: INestApplication) => {
  // app.useGlobalInterceptors(new Logging)
  // app.use(Logge)
  // setSwagger(app)
  // app.useGlobalGuards(new AuthGuard())
  // app.use((req:Request, res:Response, next) => {
  //   res.status(404).json({
  //     statusCode: 404,
  //     message: 'Route not found',
  //     path: req.originalUrl,
  //   });
  // });
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true, exceptionFactory: (errors) => {
      const errorsMessages: ErrorMessageType[] = [];

      // for (Object.keys(errors[0].))
      for (let i = 0; i < errors.length; i++) {
        const constraints = errors[i].constraints;
        if (constraints) {
          const keys = Object.keys(constraints);
          const message = constraints[keys[0]]
          errorsMessages.push({ message, field: errors[i].property})
        }

      }


      throw new BadRequestException(errorsMessages);
    }
  }));
  app.useGlobalFilters(new HttpExceptionsFilter());
};


