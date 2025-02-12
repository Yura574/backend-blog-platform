import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BlogsService } from '../../features/blogs/application/blogs.service';
import { BlogsQueryRepository } from '../../features/blogs/infrastructure/blogsQuery.repository';
import { PostQueryRepository } from '../../features/posts/infrastructure/postQueryRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../features/posts/domain/post.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';


@ValidatorConstraint({ name: 'postId', async: true })
@Injectable()
export class PostIdValidator implements ValidatorConstraintInterface {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
  }

  async validate(value: string): Promise<boolean> {
    try {
      console.log(value);
      // const post = await this.postModel.findById({ _id: value });
      // return !!post;
      return true
    } catch (err) {
      console.log(err);
      throw new Error('');
    }
  }
  defaultMessage(args: ValidationArguments): string {
    return `Post с id ${args.value} не найден`;
  }
}