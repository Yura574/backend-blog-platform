import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { UserInputModel } from '../../../users/api/models/input/createUser.input.model';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../../application/auth.service';
import { ErrorMessageType } from '../../../../infrastructure/exception-filters/exeptions';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private userRepository: UsersRepository) {
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() body: UserInputModel) {
   return  await this.authService.registration(body)
  }

  @Get('confirm-email')
  async confirmEmail(@Param('code') code: string) {
    console.log(code);
    return "reer"
  }
}