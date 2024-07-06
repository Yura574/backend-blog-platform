import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';


@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {
  }

  async deleteAllData() {
    const collections = Object.keys(this.connection.collections)
    for (const collectionName of collections) {
      const collection = this.connection.collections[collectionName]
      await collection.deleteMany({})
    }
  }
}