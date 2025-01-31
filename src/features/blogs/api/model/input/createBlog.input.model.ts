import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateBlogInputModel {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(1, 15, { message: 'length should be  min 1, max 15' })
  name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(1, 500, { message: 'length should be  min 1, max 500' })
  description: string;


  @IsString()
  @Length(1, 100)
  @Transform(({value})=> value.trim())
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    { message: 'Invalid websiteUrl format, should be https://example.com' }
  )
  websiteUrl: string;
}
