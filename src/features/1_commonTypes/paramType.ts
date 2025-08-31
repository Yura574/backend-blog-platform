import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessageType } from '../../infrastructure/exception-filters/exeptions';
import { PostIdValidator } from '../../infrastructure/validators/postId.validator';
import { BlogIdValidator } from '../../infrastructure/validators/blogId.validator';


export class ParamType {
  @IsString()
  @IsNotEmpty({message: 'Invalid id'})
  @IsString({ message: 'Invalid blog id' })
  id: string
}