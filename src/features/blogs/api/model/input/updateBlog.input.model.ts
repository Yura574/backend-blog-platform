import { IsNotEmpty, IsString, Length, Matches, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';


export class UpdateBlogInputModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value ==='string' ? value.trim() : value)
  @Length(1, 15, { message: 'length should be min 1, max 15' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value ==='string' ? value.trim() : value)
  @Length(1, 500, { message: 'length should be min 1, max 500' })
  description: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Трим только строку
  @IsString({ message: 'websiteUrl must be a string' }) // Проверка типа
  @IsNotEmpty({ message: 'length should be min 1, max 100' }) // Проверка пустой строки
  @Length(1, 100, { message: 'length should be min 1, max 100' }) // Ограничение длины
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    { message: 'Invalid websiteUrl format, should be https://example.com' }
  ) // Проверка URL
  websiteUrl: string;

}