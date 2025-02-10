import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessageType } from '../../infrastructure/exception-filters/exeptions';


export class ParamType {
  @IsString()
  // @Transform(({value})=> typeof value === 'string'? value.trim() : '')
  @Transform(({ value }) => {
    if (!Types.ObjectId.isValid(value)) {
      return ''
    }
    return value.trim();
  })
  // @Length(5, 100, {message:'length'})
  @IsNotEmpty({message: 'Invalid id'})
  @IsString({ message: 'Invalid blog id' })
  id: string
}