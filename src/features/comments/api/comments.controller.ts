import { Controller, Delete, Get, Put } from '@nestjs/common';


@Controller('comments')

export class CommentsController{
  constructor() {
  }

  @Put(':id/like-status')
  async updateCommentLikeStatus(){

  }
  @Put(':id')
  async updateComment(){

  }
  @Get(':id')
  async getCommentById(){

  }
  @Delete(':id')
  async deleteComment(){

  }
}