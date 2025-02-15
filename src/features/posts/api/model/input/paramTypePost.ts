import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { PostIdValidator } from '../../../../../infrastructure/validators/postId.validator';
import { Transform } from 'class-transformer';

export class ParamTypePost {
  @IsString()
  @Transform(({value})=> typeof value === 'string'? value.trim() : null)
  @IsNotEmpty({message: 'Invalid id'})
  @IsString({ message: 'Invalid blog id' })
  id: string
}