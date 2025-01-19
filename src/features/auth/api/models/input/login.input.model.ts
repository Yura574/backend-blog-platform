import { IsString, Length, Matches } from 'class-validator';


export class LoginInputModel {
  // @IsString()
  // @Matches(/^[^\[\]\(\)]*$/, {message: 'prohibited simbol [, ], (, )'})
  loginOrEmail: string
  @IsString()
  @Length(6, 20, {
    message: 'length password min 6, max 20'
  })
  password: string
}