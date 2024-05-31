import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../infrastructure/guards/auth.guard';

const API_PREFIX = '/api';

export const applyAppSetting = (app: INestApplication) => {
  // app.useGlobalInterceptors(new Logging)
  // app.use(Logge)
  // setSwagger(app)
  // app.useGlobalGuards(new AuthGuard());
};
