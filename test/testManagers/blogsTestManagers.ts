import request from 'supertest';
import { testApp } from '../../test-setup';
import { QueryBlogsTypes } from '../../src/features/blogs/api/model/types/queryBlogsTypes';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateBlogInputModel } from '../../src/features/blogs/api/model/input/createBlog.input.model';
import { CreatePostInputModel } from '../../src/features/posts/api/model/input/createPost.input.model';
import { QueryPostsType } from '../../src/features/posts/api/types/queryPostsType';
import * as http from 'node:http';

export const createBlogTestData: CreateBlogInputModel = {
  name: 'yura',
  websiteUrl: 'https://example.com',
  description: `description for blog`
};

export const createPostTestData: CreatePostInputModel = {
  title: 'post for blog',
  content: 'post content',
  shortDescription: 'description post'
};

export class BlogsTestManagers {
  constructor(protected app: INestApplication) {
  }

  async createBlog(data: any, status = HttpStatus.CREATED) {

    const res = await request(testApp.getHttpServer())
      .post('/blogs')
      .send(data)
      .auth('admin', 'qwerty')
      .expect(status);
    return res.body;
  }

  async createTestBlog(status = HttpStatus.CREATED) {

    const res = await request(testApp.getHttpServer())
      .post('/blogs')
      .send(createBlogTestData)
      .auth('admin', 'qwerty')
      .expect(status);
    return res.body;
  }

  async createBlogs(count: number, status = HttpStatus.CREATED) {
    for (let i = 0; i < count; i++) {
      const newBlog = {
        name: `blog ${i}`,
        websiteUrl: 'https://example.com',
        description: `description for blog ${i}`
      };
      await request(testApp.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(status);
    }


  }

  async getAllBlogs(query?: QueryBlogsTypes, status = HttpStatus.OK) {
    const params: QueryBlogsTypes = {
      pageSize: query?.pageSize ? query.pageSize : 10,
      pageNumber: query?.pageNumber ? query.pageNumber : 1,
      sortBy: query?.sortBy ? query.sortBy : 'createdAt',
      sortDirection: query?.sortDirection ? 'desc' : 'asc',
      searchNameTerm: query?.searchNameTerm ? query.searchNameTerm : ''
    };
    const res = await request(testApp.getHttpServer())
      .get(`/blogs?sortBy=${params.sortBy}&sortDirection=${params.sortDirection}&pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&searchNameTerm=${params.searchNameTerm}`)
      .expect(status);

    return res.body;
  }

  async getBlogById(blogId: string, status = HttpStatus.OK) {
    const res = await request(testApp.getHttpServer())
      .get(`/blogs/${blogId}`)
      .expect(status);
    return res.body;
  }

  async updateBlogById(blogId: string, data: any, status = HttpStatus.NO_CONTENT) {
    const res = await request(testApp.getHttpServer())
      .put(`/blogs/${blogId}`)
      .send(data)
      .auth('admin', 'qwerty')
      .expect(status);
    return res.body;
  }

  async deleteBlogById({
                         blogId,
                         status = HttpStatus.NO_CONTENT,
                         login = 'admin', password = 'qwerty'
                       }: DeleteBlogIdType) {

    const res = await request(this.app.getHttpServer())
      .delete(`/blogs/${blogId}`)
      .auth(login, password)
      .expect(status);
    return res.body;

  }

  async createPost(blogId: string, data: any, status = HttpStatus.CREATED) {
    const res = await request(testApp.getHttpServer())
      .post(`/blogs/${blogId}/posts`)
      .send(data)
      .auth('admin', 'qwerty')
      .expect(status);
    return res.body;
  }

  async createPosts(blogId: string, count: number, status = HttpStatus.CREATED) {
    for (let i = 0; i < count; i++) {
      const newBlog: CreatePostInputModel = {
        title: `post title ${i}`,
        content: 'post content',
        shortDescription: `short description for post ${i}`
      };
      await request(testApp.getHttpServer())
        .post(`/blogs/${blogId}/posts`)
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(status);
    }
  }

  async getAllPostsForBlog(blogId: string, token='', query?: QueryPostsType, status= HttpStatus.OK) {
    const params: QueryPostsType = {
      pageSize: query?.pageSize ? query.pageSize : 10,
      pageNumber: query?.pageNumber ? query.pageNumber : 1,
      sortBy: query?.sortBy ? query.sortBy : 'createdAt',
      sortDirection: query?.sortDirection ? 'desc' : 'asc'
    };
    const res = await request(testApp.getHttpServer())
      .get(`/blogs/${blogId}/posts?sortBy=${params.sortBy}&sortDirection=${params.sortDirection}&pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`)
      .auth(token, {type: 'bearer'})
      .expect(status)
    return res.body;
  };

}

type DeleteBlogIdType = {
  blogId: string,
  status?: HttpStatus
  login?: string
  password?: string
}