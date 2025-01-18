import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserInputModel } from '../../../users/api/models/input/createUser.input.model';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../../application/auth.service';
import { ConfirmationCodeInputModel } from './input/confirmationCode.input.model';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private userRepository: UsersRepository) {
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() body: UserInputModel) {
    return await this.authService.registration(body);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(@Body() body: ConfirmationCodeInputModel) {
    return await this.authService.confirmEmail(body.email, body.code);
  }

  @Post('login')
  async login (@Body() body:any){

  }
}