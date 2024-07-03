import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogInputModel } from '../api/model/input/createBlog.input.model';
import { CreateBlogDto } from '../api/model/dto/createBlogDto';
import { Injectable } from '@nestjs/common';
import { UpdateBlogInputModel } from '../api/model/input/updateBlog.input.model';

@Injectable()
export class BlogsService {
  constructor(private blogRepository: BlogsRepository) {
  }

  async createBlog(dto: CreateBlogInputModel) {
    const { description, websiteUrl, name } = dto;
    const blog: CreateBlogDto = {
      name,
      websiteUrl,
      description,
      createdAt: new Date().toISOString(),
      isMemberShip: false
    };
    return await this.blogRepository.createBlog(blog);
  }

  async updateBlog(id: string, dto: UpdateBlogInputModel) {
    return await this.blogRepository.updateBlog(id, dto);
  }
  async deleteBlog(id: string){
    return await  this.blogRepository.deleteBlog(id)
  }
}