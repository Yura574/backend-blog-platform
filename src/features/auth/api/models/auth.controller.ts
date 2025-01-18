import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserInputModel } from '../../../users/api/models/input/createUser.input.model';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../../application/auth.service';
import { ConfirmationCodeInputModel } from './input/confirmationCode.input.model';
import { LoginInputModel } from './input/login.input.model';
import { Request, Response } from 'express';


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
  async login(@Body() body: LoginInputModel,
              @Res({ passthrough: true }) res: Response) {
    const { loginOrEmail, password } = body;
    const cookie = await this.authService.login(loginOrEmail, password);

    const accessToken = {
      "accessToken": cookie.accessCookie
    }

    res.cookie('refresh token', cookie.refreshCookie);

    return accessToken;
  }
}