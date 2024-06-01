import { IsEmail, IsString } from 'class-validator';

export class CreatedUser {
  @IsString()
  id: string;

  @IsString()
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  cratedAt: string;
}
