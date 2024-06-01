import { IsEmail, IsString, Length, Matches, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'name must contain only letters, numbers, underscores, or dashes',
  })
  login: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: `incorrect email. example: example@example.com`,
  })
  email: string;
}
