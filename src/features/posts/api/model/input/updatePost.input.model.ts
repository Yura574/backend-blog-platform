import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';


export class UpdatePostInputModel {
  @IsString()
  @Transform(({value})=> typeof value === 'string'? value.trim() : '')
  @IsNotEmpty()
  @Length(1, 30, {message: 'title length should be  min 1, max 15 symbols'})
  title: string;

  @IsString()
  @Transform(({value})=> typeof value === 'string'? value.trim() : '')
  @IsNotEmpty()
  @Length(1, 100,{message: 'shortDescription length should be  min 1, max 100 symbols'})
  shortDescription: string;

  @IsString()
  @Transform(({value})=> typeof value === 'string'? value.trim() : '')
  @IsNotEmpty()
  @Length(1, 1000,{message: 'content length should be  min 1, max 1000 symbols'} )
  content: string;
}