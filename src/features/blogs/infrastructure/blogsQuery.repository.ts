import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import { Model, Schema } from 'mongoose';
import { ReturnViewModel } from '../../1_commonTypes/returnViewModel';
import { BlogViewModel } from '../api/model/output/createdBlog.output.model';
import { QueryBlogsTypes } from '../api/model/types/queryBlogsTypes';


@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {
  }

  async getBlogs(queryParams: QueryBlogsTypes): Promise<ReturnViewModel<BlogViewModel[]> | null> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortDirection = 'desc',
      sortBy = 'createdAt',
      searchNameTerm = null
    } = queryParams;
    const searchQuery =
      searchNameTerm ? { name: { $regex: new RegExp(searchNameTerm, 'i') } } : {};

    const blogsCount = await this.blogModel.countDocuments(searchQuery);
    const pagesCount = Math.ceil(blogsCount / pageSize);

    const skip = (+pageNumber - 1) * +pageSize;
    const sort: any = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
    const blogs = await this.blogModel.find(searchQuery).sort(sort).skip(skip).limit(+pageSize);
    const mappedBlogs: BlogViewModel[] = blogs.map(blog => {
      return {

        id: blog.id.toString(),
        name:  blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: new Date(blog.createdAt).toISOString(),
        isMembership: blog.isMembership
      };
    });


    return {
      page: +pageNumber,
      pagesCount: +pagesCount,
      pageSize:+pageSize,
      totalCount: blogsCount,
      items: mappedBlogs
    };
  }

  async getBlogById(blogId: string): Promise<BlogViewModel | undefined> {

  try{  const blog = await this.blogModel.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return {
      id: blog.id.toString(),
      name:  blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: new Date(blog.createdAt).toISOString()
    };
  }catch (err){
    throw new NotFoundException('Blog not found');
  }}

}