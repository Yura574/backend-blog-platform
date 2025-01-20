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

  @Post('registration-email-resending')
  async resendingEmail(@Body() body: ResendingEmailInputModel) {
    return await this.authService.resendingEmail(body.email);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    console.log(12);
    const cookie = req.cookies['refresh token'];
    console.log(req.headers['authorization']);
    return 1;

  }
}