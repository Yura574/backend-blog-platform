import { MiddlewareConsumer, Module, NestModule, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersService } from './features/users/application/users.service';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UserController } from './features/users/api/user.controller';
import { UsersQueryRepository } from './features/users/infrastructure/usersQuery.repository';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionsFilter } from './infrastructure/exception-filters/exeptions';
import { Blog, BlogSchema } from './features/blogs/domain/blog.entity';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogsQuery.repository';
import { Post, PostSchema } from './features/posts/domain/post.entity';
import { PostController } from './features/posts/api/post.controller';
import { PostRepository } from './features/posts/infrastructure/postRepository';
import { PostService } from './features/posts/application/postService';
import { PostQueryRepository } from './features/posts/infrastructure/postQueryRepository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './features/auth/application/email.service';
import * as process from 'node:process';
import { appSettings } from './settings/appSettings';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IpRestrictionMiddleware } from './infrastructure/middlewares/ipRestriction.middleware';
import { AuthController } from './features/auth/api/models/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { IpRestrictionService } from './features/ipRestriction/ipRestriction.service';
import { IpRestrictionRepository } from './features/ipRestriction/ipRestriction.repository';
import { FallbackController } from './fallback.controller';

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository
];
const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsService,
  BlogsQueryRepository
];
const postsProviders: Provider[] = [
  PostRepository,
  PostService,
  PostQueryRepository
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
        useFactory: async (configService: ConfigService) => {
          let uri = appSettings.api.MONGO_CONNECTION_URI;
          if (appSettings.env.isTesting()) {
            let mongo = await MongoMemoryServer.create();
            uri = mongo.getUri();
          }
          return { uri };
        }
      }
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          host: 'smtp.gmail.com',
          secure: true,
          port: 465,
          auth: {
            user: 'yura5742248@gmail.com',
            pass: 'evgs shsm qmme vibh'
          },
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [UserController, BlogsController, PostController, AppController, AuthController, FallbackController],
  providers: [...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    EmailService,
    AuthService,
     {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter
    }, AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpRestrictionMiddleware)
      .forRoutes('auth')
  }
}
