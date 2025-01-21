import { IsString } from 'class-validator';

export class ConfirmationCodeInputModel {

  @IsString()
  code: string;
}