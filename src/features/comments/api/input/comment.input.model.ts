import { IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';


export class CommentInputModel {
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : '')
  @IsNotEmpty()
  @Length(20, 300, { message: 'content length should be  min 20, max 300 symbols' })
  content: string;
}