import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserInputModel } from '../../../users/api/models/input/createUser.input.model';
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
import { RegistrationUseCase } from '../../application/useCases/registration.use-case';
import { EmailConfirmationUseCase } from '../../application/useCases/emailConfirmation.use-case';
import { LoginUseCase } from '../../application/useCases/login.use-case';
import { RecoveryPasswordUseCase } from '../../application/useCases/recoveryPassword.use-case';
import { NewPasswordUseCase } from '../../application/useCases/newPassword.use-case';
import { LoginOutputModel } from './output/login.output.model';
import { UserViewModel } from '../../../users/api/models/output/createdUser.output.model';
import { ResendingEmailUseCase } from '../../application/useCases/resendingEmail.use-case';
import { RefreshTokenInputModel } from './input/refreshToken.input.model';
import { ParamType } from '../../../1_commonTypes/paramType';
import {
  AuthUserType,
  FindUserType,
  UserType,
} from '../../../users/api/models/types/userType';
import { createPairTokens } from '../../utils/createPairTokens';
import { RefreshTokenGuard } from '../../../../infrastructure/guards/refreshToken.guard';
import { MeUseCase } from '../../application/useCases/me.use-case';

export enum authEndPoints {
  BASE = 'auth',
  REGISTRATION = 'registration',
  REGISTRATION_CONFIRMATION = 'registration-confirmation',
  LOGIN = 'login',
  LOGOUT = 'logout',
  REFRESH_TOKEN = 'refresh-token',
  RECOVERY_PASSWORD = 'recovery-password',
  NEW_PASSWORD = 'new-password',
  REGISTRATION_EMAIL_RESENDING = 'registration-email-resending',
  ME = 'me',
}

@Controller(authEndPoints.BASE)
export class AuthController {
  constructor(
    private authService: AuthService,
    private registrationUseCase: RegistrationUseCase,
    private emailConfirmation: EmailConfirmationUseCase,
    private loginUseCase: LoginUseCase,
    private recoveryPasswordUseCase: RecoveryPasswordUseCase,
    private newPasswordUseCase: NewPasswordUseCase,
    private resendingEmailUseCase: ResendingEmailUseCase,
    private meUseCase: MeUseCase,
  ) {}

  @Post(authEndPoints.REGISTRATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(
    @Body() body: UserInputModel,
  ): Promise<UserViewModel | void> {
    console.log(body);
    return await this.registrationUseCase.execution(body);
  }

  @Post(authEndPoints.REGISTRATION_CONFIRMATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(@Body() body: ConfirmationCodeInputModel) {
    return await this.emailConfirmation.execute(body.code);
  }

  @Post(authEndPoints.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginInputModel,
    @Req() req: RequestType<{}, {}, {}>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginOutputModel> {
    const { loginOrEmail, password } = body;
    const cookie = await this.loginUseCase.execute(loginOrEmail, password, req);

    const accessToken = {
      accessToken: cookie.accessToken,
    };

    res.cookie('refreshToken', cookie.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return accessToken;
  }

  @UseGuards(RefreshTokenGuard)
  @Post(authEndPoints.LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  }

  @Post(authEndPoints.RECOVERY_PASSWORD)
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoveryPassword(@Body() body: RecoveryPasswordInputModel) {
    return await this.recoveryPasswordUseCase.execute(body.email);
  }

  @Post(authEndPoints.NEW_PASSWORD)
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: NewPasswordInputModel) {
    return await this.newPasswordUseCase.execute(body);
  }

  @Post(authEndPoints.REGISTRATION_EMAIL_RESENDING)
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendingEmail(@Body() body: ResendingEmailInputModel) {
    return await this.resendingEmailUseCase.execute(body.email);
  }

  @UseGuards(RefreshTokenGuard)
  @Post(authEndPoints.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: RequestType<ParamType, {}, {}>,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log(req.user);
    if (!req.user) {
      throw new UnauthorizedException('password or login or password');
    }
    const cookie = createPairTokens(req.user);
    const accessToken = {
      accessToken: cookie.accessToken,
    };

    res.cookie('refreshToken', cookie.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return accessToken;
  }

  @UseGuards(AuthGuard)
  @Get(authEndPoints.ME)
  async me(
    @Req() req: RequestType<{}, {}, {}>,
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    // const findUser = await this.meUseCase.execute(user);
    const returnUser: AuthUserType = {
      userId: user.userId,
      login: user.login,
      email: user.email,
    };
    return returnUser;
  }
}
