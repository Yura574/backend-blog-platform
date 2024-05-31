import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { Request } from 'express';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get()
  async hello(@Query('id') id: number, @Req() req: Request) {}
}
