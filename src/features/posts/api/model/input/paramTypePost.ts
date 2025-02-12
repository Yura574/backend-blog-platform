import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';

export class ParamTypePost {
  @IsString()
  // @Transform(({value})=> typeof value === 'string'? value.trim() : '')
  // @Validate(PostIdValidator)
  // @Transform(({ value }) => {
  //   if (!Types.ObjectId.isValid(value)) {
  //     return ''
  //   }
  //   return value.trim();
  // })
  // @Length(5, 100, {message:'length'})
  @IsNotEmpty({message: 'Invalid id'})
  @IsString({ message: 'Invalid blog id' })
  id: string
}