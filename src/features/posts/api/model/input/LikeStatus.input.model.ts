import { IsEnum } from 'class-validator';


export class LikeStatusInputModel {
  @IsEnum(['None', 'Like', 'Dislike'], { message: 'Invalid status' })
  status: 'None' | 'Like' | 'Dislike';
}