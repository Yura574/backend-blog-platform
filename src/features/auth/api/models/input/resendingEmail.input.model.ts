import { IsEmail, Matches } from 'class-validator';


export class ResendingEmailInputModel{
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: `incorrect email. example: example@example.com`,
  })
  email: string
}