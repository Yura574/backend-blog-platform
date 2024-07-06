import { Module, Provider } from '@nestjs/common';
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

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];
const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsService,
  BlogsQueryRepository,
];
const postsProviders: Provider[] = [
  PostRepository,
  PostService,
  PostQueryRepository
];

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://yura5742248:unbiliever13@cluster0.mowhzah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: 'blog-platform' },
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [UserController, BlogsController, PostController, AppController],
  providers: [...usersProviders, ...blogsProviders, ...postsProviders, {
    provide: APP_FILTER,
    useClass: HttpExceptionsFilter,
  }, AppService],
})
export class AppModule {}
