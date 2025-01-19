import { BadRequestException,  INestApplication, ValidationPipe } from '@nestjs/common';
import { ErrorMessageType, HttpExceptionsFilter } from '../infrastructure/exception-filters/exeptions';
import cookieParser from 'cookie-parser'

export const applyAppSetting = (app: INestApplication) => {
  // app.useGlobalInterceptors(new Logging)
  // app.use(Logge)
  // setSwagger(app)
  // app.useGlobalGuards(new AuthGuard())
app.use(cookieParser())
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


