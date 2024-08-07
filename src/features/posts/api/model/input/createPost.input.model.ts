import { IsOptional, IsString, Length } from 'class-validator';


export class CreatePostInputModel {
  @IsString()
  @Length(1,30)
  title: string

  @IsString()
  @Length(1,100)
  shortDescription: string

  @IsString()
  @Length(1,1000)
  content: string

  @IsOptional()
  @IsString()
  blogId?: string

}