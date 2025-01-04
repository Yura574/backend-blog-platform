import { IsEmail, IsString } from 'class-validator';

export class UserViewModel {
  @IsString()
  id: string;

  @IsString()
  login: string;

  @IsEmail()
  email: string;

  // @IsString()
  // createdAt: string;
}
