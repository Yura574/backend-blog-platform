import { MongoMemoryServer } from 'mongodb-memory-server';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './src/app.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import request from 'supertest';

export class TestSetup {
  public app: INestApplication;
  public mongod: MongoMemoryServer;
  public mongoConnection: Connection;

  async init() {
    this.mongod = await MongoMemoryServer.create();
    const uri =   this.mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot(uri, { dbName: 'test-db' }),
      ],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();

    this.mongoConnection = moduleFixture.get<Connection>(getConnectionToken());
    return this.app
  }

  async close() {
    await this.mongoConnection.dropDatabase();
    await this.mongoConnection.close();
    await this.mongod.stop();
    await this.app.close();
  }

  async clearDatabase() {
    await request(this.app.getHttpServer())
      .delete('/testing/all-data')
  }
}