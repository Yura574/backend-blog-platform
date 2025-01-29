import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
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
import { AuthGuard } from '../../../../infrastructure/guards/auth.guard';
import * as process from 'node:process';
import { JwtPayloadType } from '../../../1_commonTypes/jwtPayloadType';
import { RequestType } from '../../../1_commonTypes/commonTypes';
import { RegistrationUseCase } from '../../application/registration.use-case';
import { EmailConfirmation } from '../../../users/domain/user.entity';
import { EmailConfirmationUseCase } from '../../application/emailConfirmation.use-case';

export enum authEndPoints {
  BASE = 'auth',
  REGISTRATION = 'registration',
  REGISTRATION_CONFIRMATION = 'registration-confirmation',
  LOGIN = 'login',
  REFRESH_TOKEN = '',
  RECOVERY_PASSWORD = 'recovery-password',
  NEW_PASSWORD = 'new-password',
  REGISTRATION_EMAIL_RESENDING = 'registration-email-resending',
  ME = 'me'

}


@Controller(authEndPoints.BASE)
export class AuthController {
  constructor(private authService: AuthService,
              private registrationUseCase: RegistrationUseCase,
              private emailConfirmation: EmailConfirmationUseCase,
  ) {
  }

  @Post(authEndPoints.REGISTRATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: UserInputModel) {
    return await this.registrationUseCase.execution(body);
  }

  @Post(authEndPoints.REGISTRATION_CONFIRMATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(@Body() body: ConfirmationCodeInputModel) {
    return await this.emailConfirmation.execute(body.code);
  }


  @Post(authEndPoints.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginInputModel,
              @Res({ passthrough: true }) res: Response) {
    const { loginOrEmail, password } = body;
    const cookie = await this.authService.login(loginOrEmail, password);

    const accessToken = {
      accessToken: cookie.accessCookie
    };


    res.cookie('refresh token', cookie.refreshCookie);

    return accessToken;
  }

  @Post(authEndPoints.RECOVERY_PASSWORD)
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoveryPassword(@Body() body: RecoveryPasswordInputModel) {
    return await this.authService.recoveryPassword(body.email);
  }

  @Post(authEndPoints.NEW_PASSWORD)
  async newPassword(@Body() body: NewPasswordInputModel,
                    @Req() req: RequestType<{}, {}, {}>
  ) {
    const token = req.cookies['refresh token'];
    const decodeToken = jwt.verify(token, process.env.REFRESH_SECRET as string) as JwtPayloadType;
    req.user = {
      userId: decodeToken.userid,
      login: decodeToken.login,
      email: decodeToken.email
    };
    return await this.authService.newPassword(body, 'decodeToken');
  }

  @Post(authEndPoints.REGISTRATION_EMAIL_RESENDING)
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendingEmail(@Body() body: ResendingEmailInputModel) {
    return await this.authService.resendingEmail(body.email);
  }

  @UseGuards(AuthGuard)
  @Get(authEndPoints.ME)
  async me(@Req() req: Request) {
    console.log(12);
    const cookie = req.cookies['refresh token'];
    console.log(req.headers['authorization']);
    return 1;

  }
}