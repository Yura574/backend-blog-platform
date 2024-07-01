import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogInputModel } from '../api/model/input/createBlog.input.model';
import { CreateBlogDto } from '../../users/api/models/dto/createBlogDto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsService {
  constructor(private blogRepository: BlogsRepository) {
  }

  async createBlog(data: CreateBlogInputModel) {
    const { description, websiteUrl, name } = data;
    const blog: CreateBlogDto = {
      name,
      websiteUrl,
      description,
      createdAt: new Date().toISOString(),
      isMemberShip: false
    };
    console.log(blog);
    return await this.blogRepository.createBlog(blog)
  }
}