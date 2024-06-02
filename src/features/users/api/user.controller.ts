import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from './models/input/createUser.input.model';
import { UserViewModel } from './models/output/createdUser.output.model';

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserViewModel> {
    console.log(dto);
    const result = await this.usersService.createUser(dto);
    return result.data;
  }
}
