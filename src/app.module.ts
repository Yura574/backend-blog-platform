import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersService } from './features/users/application/users.service';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UserController } from './features/users/api/user.controller';
import { UsersQueryRepository } from './features/users/infrastructure/usersQuery.repository';

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://yura5742248:unbiliever13@cluster0.mowhzah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: 'blog-platform' },
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [...usersProviders],
})
export class AppModule {}
