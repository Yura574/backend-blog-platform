import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ParamType } from '../../1_commonTypes/paramType';
import { CommentService } from '../application/comment.service';
import { CommentOutputModel } from './output/comment.output.model';
import { CommentQueryRepository } from '../infrastructure/commentQuery.repository';
import { RequestType } from '../../1_commonTypes/commonTypes';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { CommentInputModel } from './input/comment.input.model';
import { LikeStatusInputModel } from '../../posts/api/model/input/LikeStatus.input.model';
import jwt from 'jsonwebtoken';
import * as process from 'node:process';
import { JwtPayloadType } from '../../1_commonTypes/jwtPayloadType';
import { GetUserDataGuard } from '../../../infrastructure/guards/getUserData.guard';


@Controller('comments')

export class CommentsController {
  constructor(private commentService: CommentService,
              private commentQueryRepository: CommentQueryRepository) {
  }

  @Put(':id/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentLikeStatus(@Body() body: LikeStatusInputModel,
                                @Req() req: RequestType<ParamType, {}, {}>) {
    if (!req.user) throw new UnauthorizedException();
    return await this.commentService.updateLikeStatus(req.params.id, body.likeStatus, req.user.userId, req.user.login);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(@Body() body: CommentInputModel,
                      @Req() req: RequestType<ParamType, {}, {}>) {
    if (!req.user) throw new UnauthorizedException();
    return this.commentService.updateComment(req.params.id, body.content, req.user.userId);
  }

  @UseGuards(GetUserDataGuard)
  @Get(':id')
  async getCommentById(@Req() req: RequestType<ParamType, {}, {}>): Promise<CommentOutputModel | null> {
    return await this.commentQueryRepository.getCommentById(req.params.id, req.user?.userId);

  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Req() req: RequestType<ParamType, {}, {}>) {
    if (!req.user?.userId) throw new UnauthorizedException();
    return await this.commentService.deleteComment(req.params.id, req.user.userId);
  }
}