import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { Request } from 'express';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { CreateUserDto } from './models/input/createUser.input.model';
import { CreatedUser } from './models/output/createdUser.output.model';
import { ResultStatus } from '../../../infrastructure/utils/objectResult';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<CreatedUser> {
    const result = await this.usersService.createUser(dto);
    if (result.status === ResultStatus.Success) return result.data;
    return { login: '', cratedAt: '', email: '', id: '' };
  }
}
