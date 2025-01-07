import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
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
  async confirmEmail(@Query('code') code: string) {
    const [email, confirmCode] = code.split('_');
    console.log(email, confirmCode);

    await this.authService.confirmEmail(email, confirmCode)
    return "reer"
  }
}