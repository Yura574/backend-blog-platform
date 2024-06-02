import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../infrastructure/guards/auth.guard';
import { HttpExceptionsFilter } from '../infrastructure/exception-filters/exeptions';

const API_PREFIX = '/api';

export const applyAppSetting = (app: INestApplication) => {
  // app.useGlobalInterceptors(new Logging)
  // app.use(Logge)
  // setSwagger(app)
  // app.useGlobalGuards(new AuthGuard())
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.useGlobalFilters(new HttpExceptionsFilter());
};
