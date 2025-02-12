import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, Put,
  Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { PostService } from '../application/postService';
import { CreatePostInputModel } from './model/input/createPost.input.model';
import { RequestType } from '../../1_commonTypes/commonTypes';
import { QueryPostsType } from './types/queryPostsType';
import { PostQueryRepository } from '../infrastructure/postQueryRepository';
import { ParamType } from '../../1_commonTypes/paramType';
import { UpdatePostInputModel } from './model/input/updatePost.input.model';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { AuthUserType } from '../../users/api/models/types/userType';
import { LikeStatusInputModel } from './model/input/LikeStatus.input.model';
import { CommentInputModel } from '../../comments/api/input/comment.input.model';
import { CommentService } from '../../comments/application/comment.service';
import { CommentOutputModel } from '../../comments/api/output/comment.output.model';
import { QueryCommentsType } from '../../comments/api/types/QueryComments.type';
import { CommentQueryRepository } from '../../comments/infrastructure/commentQuery.repository';
import { GetUserDataGuard } from '../../../infrastructure/guards/getUserData.guard';
import { Validate } from 'class-validator';
import { PostIdValidator } from '../../../infrastructure/validators/postId.validator';
import { ParamTypePost } from './model/input/paramTypePost';


@Controller('posts')
export class PostController {
  constructor(private postService: PostService,
              private postQueryRepository: PostQueryRepository,
              private commentService: CommentService,
              private commentQueryRepository: CommentQueryRepository) {
  }

  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Body() dto: CreatePostInputModel) {
    return await this.postService.createPost(dto);
  }

  @UseGuards(GetUserDataGuard)
  @Get()
  async getPosts(@Req() req: RequestType<{}, {}, QueryPostsType>) {

    return await this.postQueryRepository.getPosts(req.query, req.user?.userId);
  }

  @Get(':id')
  @UseGuards(GetUserDataGuard)
  async getPostById(@Param() param: ParamType,
                    @Req() req: RequestType<{}, {}, {}>) {
    return await this.postQueryRepository.getPostById(param.id, req.user?.userId);
  }

  @UseGuards(AuthGuard)

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param() param: ParamTypePost,
                   @Body() body: UpdatePostInputModel) {
    console.log(param.id);
    return await this.postService.updatePost(param.id, body);
  }

  @UseGuards(AuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostLikeStatus(@Param() param: ParamType,
                             @Req() req: RequestType<{}, {}, {}>,
                             @Body() body: LikeStatusInputModel) {
    const userData: AuthUserType | undefined = req.user;

    if (!userData) throw new UnauthorizedException();
    await this.postService.updateLikeStatusPost(param.id, body.likeStatus, userData);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() param: ParamType) {
    return await this.postService.deletePost(param.id);
  }


  @Post(`:id/comments`)
  @UseGuards(AuthGuard)
  async createComment(
    @Body() body: CommentInputModel,
                      @Req() req: RequestType<ParamTypePost, CommentInputModel, {}>): Promise<CommentOutputModel | void> {
    if (!req.user) throw new UnauthorizedException();
    const { userId, login } = req.user;
    await this.postQueryRepository.getPostById(req.params.id);

    const comment = await this.commentService.createComment(req.params.id, body.content, userId, login);
    //id
    // get comment by id
    return comment;
  }

  @Get(':id/comments')
  @UseGuards(GetUserDataGuard)
  async getCommentsByPostId(@Req() req: RequestType<ParamType, {}, QueryCommentsType>) {
    await this.postQueryRepository.getPostById(req.params.id);
    return await this.commentQueryRepository.getCommentsByPostId(req.params.id, req.query, req.user?.userId);
  }
}