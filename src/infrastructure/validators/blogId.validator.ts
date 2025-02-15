import {
  registerDecorator, ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { BlogsQueryRepository } from '../../features/blogs/infrastructure/blogsQuery.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../features/blogs/domain/blog.entity';
import { Model, Types } from 'mongoose';

@ValidatorConstraint({ name: 'IsBlogExists', async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {
  }

  async validate(blogId: string): Promise<boolean> {
    if(!Types.ObjectId.isValid(blogId)) return false
    const blog = await this.blogModel.findById({ _id: blogId });
    return !!blog
  }

  defaultMessage(args: ValidationArguments): string {
    return `Блог с id ${args.value} не найден`;
  }
}

//
// export function IsBlogExists(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'BlogIdValidator',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: BlogIdValidator,
//     });
//   };
// }