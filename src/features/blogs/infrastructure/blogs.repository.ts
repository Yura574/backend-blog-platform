import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import { Model } from 'mongoose';
import { BlogViewModel } from '../api/model/output/createdBlog.output.model';
import { CreateBlogDto } from '../../users/api/models/dto/createBlogDto';


@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {
  }

  async createBlog(dto: CreateBlogDto): Promise<BlogViewModel | null> {
    try {
      const createdBlog = await this.blogModel.create(dto);
      const blog = await createdBlog.save();
      const { id, name, description, websiteUrl, createdAt, isMemberShip } = blog;
      return { id, name, description, websiteUrl, createdAt, isMemberShip };
    } catch (err) {
      throw new HttpException('something was wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async deleteBlog(blogId: string) {
    const result = await this.blogModel.deleteOne({ _id: blogId });
    if (!result.deletedCount) {
      throw new NotFoundException('Blog not found');
    }
    return result;
  }
}