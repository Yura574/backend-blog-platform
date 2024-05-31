import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSetting } from './settings/apply-app-setting';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyAppSetting(app);
  await app.listen(3000, () => {
    console.log('App starting listen post ');
  });
}

bootstrap();
