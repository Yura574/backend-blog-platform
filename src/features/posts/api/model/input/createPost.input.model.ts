import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreatePostInputModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({value})=> value.trim())
  @Length(1,30)
  title: string

  @IsString()
  @IsNotEmpty()
  @Transform(({value})=> value.trim())
  @Length(1,100)
  shortDescription: string

  @IsString()
  @IsNotEmpty()
  @Transform(({value})=> value.trim())
  @Length(1,1000)
  content: string

  @IsOptional()
  @IsString()
  blogId?: string

}