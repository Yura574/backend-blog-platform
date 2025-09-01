import {
  MiddlewareConsumer,
  Module,
  Provider,
  RequestMethod,
} from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
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
import { appSettings } from './settings/appSettings';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IpRestrictionMiddleware } from './infrastructure/middlewares/ipRestriction.middleware';
import { AuthController } from './features/auth/api/models/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { FallbackController } from './fallback.controller';
import { RecoveryPassword, RecoveryPasswordSchema } from './entity/recoveryPassword.entity';
import { RecoveryPasswordService } from './features/auth/application/recoveryPassword.service';
import { RecoveryPasswordRepository } from './features/auth/infractructure/recoveryPassword.repository';
import { RecoveryPasswordUseCase } from './features/auth/application/useCases/recoveryPassword.use-case';
import { LoginUseCase } from './features/auth/application/useCases/login.use-case';
import { EmailConfirmationUseCase } from './features/auth/application/useCases/emailConfirmation.use-case';
import { RegistrationUseCase } from './features/auth/application/useCases/registration.use-case';
import { NewPasswordUseCase } from './features/auth/application/useCases/newPassword.use-case';
import { CommentRepository } from './features/comments/infrastructure/comment.repository';
import { CommentService } from './features/comments/application/comment.service';
import { Comment, CommentSchema } from './features/comments/domain/comment.entity';
import { CommentsController } from './features/comments/api/comments.controller';
import { CommentQueryRepository } from './features/comments/infrastructure/commentQuery.repository';
import { ResendingEmailUseCase } from './features/auth/application/useCases/resendingEmail.use-case';
import { BlogIdValidator } from './infrastructure/validators/blogId.validator';
import { PostIdValidator } from './infrastructure/validators/postId.validator';
import { MeUseCase } from './features/auth/application/useCases/me.use-case';
import {
  UserDeviceInfo,
  UserDeviceInfoSchema,
} from './features/userDiveces/domain/userDeviceInfo.entity';
import { UserDeviceInfoRepository } from './features/userDiveces/infrastructure/userDeviceInfo.repository';
import { UserDeviceInfoService } from './features/userDiveces/aplication/userDeviceInfo.service';

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

const commentsProviders: Provider[] = [
  CommentRepository,
  CommentQueryRepository,
  CommentService
];
const recoveryPasswordProviders: Provider[] = [
  RecoveryPasswordService,
  RecoveryPasswordRepository
];
const devicesIpProviders: Provider[] = [
  UserDeviceInfoRepository,
  UserDeviceInfoService,
];

const authUseCases: Provider[] = [
  RegistrationUseCase,
  EmailConfirmationUseCase,
  LoginUseCase,
  RecoveryPasswordUseCase,
  NewPasswordUseCase,
  ResendingEmailUseCase,
  MeUseCase,
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
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: RecoveryPassword.name, schema: RecoveryPasswordSchema }]),
    MongooseModule.forFeature([{ name: UserDeviceInfo.name, schema: UserDeviceInfoSchema }]),

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
          }
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [
    UserController,
    BlogsController,
    PostController,
    CommentsController,
    AppController,
    AuthController,
    FallbackController
  ],
  providers: [
    AppService,
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    ...devicesIpProviders,
    EmailService,
    ...recoveryPasswordProviders,
    AuthService,
    ...authUseCases,
    BlogIdValidator,
    PostIdValidator,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter
    }
    // {
    //   provide: BlogIdValidator,
    //   useFactory: (blogModel: Model<Blog>) => new BlogIdValidator(blogModel),
    //   inject: [getModelToken(Blog.name)], // Важно!
    // },

   ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpRestrictionMiddleware)
      .forRoutes('auth');
  }
}
