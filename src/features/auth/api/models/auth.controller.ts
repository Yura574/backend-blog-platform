import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserInputModel } from '../../../users/api/models/input/createUser.input.model';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../../application/auth.service';
import { ConfirmationCodeInputModel } from './input/confirmationCode.input.model';
import { LoginInputModel } from './input/login.input.model';
import { Request, Response } from 'express';
import { RecoveryPasswordInputModel } from './input/recoveryPassword.input.model';
import { NewPasswordInputModel } from './input/newPassword.input.model';
import jwt from 'jsonwebtoken';
import { ResendingEmailInputModel } from './input/resendingEmail.input.model';


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
    console.log(loginOrEmail);
    const cookie = await this.authService.login(loginOrEmail, password);

    const accessToken = {
      'accessToken': cookie.accessCookie
    };


    res.cookie('refresh token', cookie.refreshCookie);

    return accessToken;
  }

  @Post('recovery-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoveryPassword(@Body() body: RecoveryPasswordInputModel) {
    return await this.authService.recoveryPassword(body.email);
  }

  @Post('new-password')
  async newPassword(@Body() body: NewPasswordInputModel,
                    @Req() req: Request) {
    const token = req.cookies['refresh token'];
    const decodeToken = jwt.decode(token);
    return await this.authService.newPassword(body, decodeToken.email);
  }

  @Post('registration-email-resending')
  async resendingEmail(@Body() body: ResendingEmailInputModel) {
    return await this.authService.resendingEmail(body.email);
  }
}