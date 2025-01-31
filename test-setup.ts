import * as process from 'node:process';

process.env.ENV = 'TESTING';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';


import mongoose, { Connection } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './src/app.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import request from 'supertest';
import { EmailService } from './src/features/auth/application/email.service';
import { EmailServiceMock } from './test/mockServices/emailServiceMock';
import { RegistrationMockUseCase } from './test/mockServices/registrationMockService';
import { RegistrationUseCase } from './src/features/auth/application/useCases/registration.use-case';
import { UsersRepository } from './src/features/users/infrastructure/users.repository';
import { RecoveryPasswordUseCase } from './src/features/auth/application/useCases/recoveryPassword.use-case';
import { RecoveryPasswordMockUseCase } from './test/mockServices/recoveryPasswordMockUseCase';
import { ErrorMessageType } from './src/infrastructure/exception-filters/exeptions';
import { validationError } from './src/infrastructure/utils/validationError';

export let testApp: INestApplication;
export let testSetup: TestSetup;


export const initializeTestSetup = async () => {
  testSetup = new TestSetup();
  testApp = await testSetup.init();
};
export const closeTest = async () => {
  await testSetup.close();
};

export const clearDatabase = async () => {
  await testSetup.clearDatabase();
};

export class TestSetup {

  public app: INestApplication;
  public mongod: MongoMemoryServer;
  public mongoConnection: Connection;

  async init() {
    this.mongod = await MongoMemoryServer.create();
    const uri = this.mongod.getUri();
    await mongoose.connect(uri);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri, { dbName: 'test-db' }),
        AppModule
      ]
    })
      .overrideProvider(EmailService)
      .useClass(EmailServiceMock)
      .overrideProvider(RegistrationUseCase)
      .useClass(RegistrationMockUseCase)
      .overrideProvider(RecoveryPasswordUseCase)
      .useClass(RecoveryPasswordMockUseCase)
      .compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const errorsMessages = validationError(errors);
        throw new BadRequestException(errorsMessages);
      }
    }));
    await this.app.init();


    this.mongoConnection = moduleFixture.get<Connection>(getConnectionToken());
    return this.app;
  }

  async close() {
    await this.mongoConnection.dropDatabase();
    await this.mongoConnection.close();
    await this.mongod.stop();
    await this.app.close();
  }

  async clearDatabase() {
    await request(this.app.getHttpServer())
      .delete('/testing/all-data');
  }
}