import { BadRequestException, HttpException, INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../infrastructure/guards/auth.guard';
import { HttpExceptionsFilter } from '../infrastructure/exception-filters/exeptions';

const API_PREFIX = '/api';

export const applyAppSetting = (app: INestApplication) => {
  // app.useGlobalInterceptors(new Logging)
  // app.use(Logge)
  // setSwagger(app)
  // app.useGlobalGuards(new AuthGuard())
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true, exceptionFactory: (errors) => {
      const errorsMessages: { message: string, field: string }[] = [];

      // for (Object.keys(errors[0].))
      for (let i = 0; i < errors.length; i++) {
        const constraints = errors[i].constraints;
        if (constraints) {
          const keys = Object.keys(constraints);
          const message = constraints[keys[0]]
          errorsMessages.push({message, field: errors[i].property})
        }

        // console.log(Object.keys(errors[i].constraints));
        // const keys = errors[i].constraints.map
      }


      throw new BadRequestException(errorsMessages);
    }
  }));
  app.useGlobalFilters(new HttpExceptionsFilter());
};
