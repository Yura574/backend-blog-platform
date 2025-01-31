import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { ErrorMessageType, HttpExceptionsFilter } from '../infrastructure/exception-filters/exeptions';
import cookieParser from 'cookie-parser';
import { validationError } from '../infrastructure/utils/validationError';

export const applyAppSetting = (app: INestApplication) => {
  // app.useGlobalInterceptors(new Logging)
  // app.use(Logge)
  // setSwagger(app)
  // app.useGlobalGuards(new AuthGuard())
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    exceptionFactory: (errors) => {
      const errorsMessages = validationError(errors);
      throw new BadRequestException(errorsMessages);
    }
  }));
  app.useGlobalFilters(new HttpExceptionsFilter());
};


