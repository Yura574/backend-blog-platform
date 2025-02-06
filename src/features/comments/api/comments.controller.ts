import {
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


@Controller('comments')

export class CommentsController {
  constructor(private commentService: CommentService,
              private commentQueryRepository: CommentQueryRepository) {
  }

  @Put(':id/like-status')
  async updateCommentLikeStatus() {

  }

  @Put(':id')
  async updateComment() {

  }

  @Get(':id')
  async getCommentById(@Param() param: ParamType): Promise<CommentOutputModel | void> {
    return await this.commentQueryRepository.getCommentById(param.id);

  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Req() req: RequestType<ParamType, {}, {}>) {
    if(!req.user?.userId) throw new UnauthorizedException()
    return await this.commentService.deleteComment(req.params.id, req.user.userId)
  }
}