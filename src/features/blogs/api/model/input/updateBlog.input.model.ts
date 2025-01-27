import { IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';


export class UpdateBlogInputModel {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 15, { message: 'length should be  min 1, max 15' })
  name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 500, { message: 'length should be  min 1, max 500' })
  description: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 100, { message: 'length should be  min 1, max 100' })
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    { message: 'Invalid websiteUrl format, should be https://example.com' },
  )
  websiteUrl: string;
}