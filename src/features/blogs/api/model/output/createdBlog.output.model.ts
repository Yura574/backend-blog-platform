import { IsString } from 'class-validator';

export class BlogViewModel {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  websiteUrl: string;

  @IsString()
  createdAt: string;

  @IsString()
  isMemberShip: boolean;
}
