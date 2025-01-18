import { IsEmail, IsString, Matches } from 'class-validator';

export class ConfirmationCodeInputModel {

  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: `incorrect email. example: example@example.com`,
  })
  email: string;

  @IsString()
  code: string;
}