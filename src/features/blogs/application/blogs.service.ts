import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogInputModel } from '../api/model/input/createBlog.input.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBlogInputModel } from '../api/model/input/updateBlog.input.model';
import { PostRepository } from '../../posts/infrastructure/postRepository';
import { BlogsQueryRepository } from '../infrastructure/blogsQuery.repository';
import { NewBlogType } from '../api/model/types/newBlogType';
import { PostQueryRepository } from '../../posts/infrastructure/postQueryRepository';
import { QueryPostsType } from '../../posts/api/types/queryPostsType';

@Injectable()
export class BlogsService {
  constructor(private blogRepository: BlogsRepository,
              private blogQueryRepository: BlogsQueryRepository,
              private postRepository: PostRepository,
              private  postQueryRepository: PostQueryRepository,) {
  }

  async createBlog(dto: CreateBlogInputModel) {
    const { description, websiteUrl, name } = dto;
    const blog: NewBlogType = {
      name,
      websiteUrl,
      description,
      createdAt: new Date().toISOString(),
      isMembership: false
    };
    return await this.blogRepository.createBlog(blog);
  }

  async updateBlog(id: string, dto: UpdateBlogInputModel) {
    return await this.blogRepository.updateBlog(id, dto);
  }

  async deleteBlog(id: string) {
    return await this.blogRepository.deleteBlog(id);
  }

  async getPosts(blogId: string, query: QueryPostsType){
    return await this.postQueryRepository.getPosts(query, blogId)
  }
}