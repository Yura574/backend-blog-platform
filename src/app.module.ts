import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './features/users/domain/users.repository';
import { UsersService } from './features/users/application/users.service';

const usersProviders: Provider[] = [UsersRepository, UsersService];
@Module({
  imports: [MongooseModule.forRoot('')],
  controllers: [],
  providers: [...usersProviders],
})
export class AppModule {}
