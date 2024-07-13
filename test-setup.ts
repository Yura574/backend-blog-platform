import * as process from 'node:process';

process.env.ENV= 'TESTING'

import { MongoMemoryServer } from 'mongodb-memory-server';
import { INestApplication } from '@nestjs/common';


import mongoose, { Connection } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './src/app.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import request from 'supertest';

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
    await mongoose.connect(uri)

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri, { dbName: 'test-db' }),
        AppModule
      ]
    }).compile();

    this.app = moduleFixture.createNestApplication();
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