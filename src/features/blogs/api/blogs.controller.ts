import { Body, Controller, Post } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogInputModel } from './model/input/createBlog.input.model';


@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {
  }

  @Post()
  async createBlog(@Body() data: CreateBlogInputModel) {
    return await this.blogsService.createBlog(data)
  }
}