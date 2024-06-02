import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from './models/input/createUser.input.model';
import { UserViewModel } from './models/output/createdUser.output.model';
import { Request } from 'express';
import { UsersQueryRepository } from '../infrastructure/usersQuery.repository';
import { ReturnViewModel } from '../../commonTypes/returnViewModel';
import { UserType } from './models/types/userType';

@Controller('users')
export class UserController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserViewModel> {
    console.log(dto);
    const result = await this.usersService.createUser(dto);
    return result.data;
  }

  @Get()
  async getUsers(@Req() req: Request): Promise<ReturnViewModel<UserType[]>> {
    return await this.usersQueryRepository.getUsers(req.query);
  }
}
