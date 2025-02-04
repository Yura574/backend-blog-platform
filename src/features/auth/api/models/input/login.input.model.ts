import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';


export class LoginInputModel {
  @IsString()
  @Transform(({value})=> typeof value === 'string'? value.trim() : '')
  @IsNotEmpty()
  loginOrEmail: string

  @IsString()
  @Transform(({value})=> typeof value === 'string'? value.trim() : '')
  @IsNotEmpty()
  password: string
}