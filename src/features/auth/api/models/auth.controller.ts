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
import { ConfirmationCodeInputModel } from './input/confirmationCode.input.model';
import { LoginInputModel } from './input/login.input.model';
import { Request, Response } from 'express';
import { RecoveryPasswordInputModel } from './input/recoveryPassword.input.model';
import { NewPasswordInputModel } from './input/newPassword.input.model';
import { ResendingEmailInputModel } from './input/resendingEmail.input.model';
import { AuthGuard } from '../../../../infrastructure/guards/auth.guard';
import { RequestType } from '../../../1_commonTypes/commonTypes';
import { RegistrationUseCase } from '../../application/useCases/registration.use-case';
import { EmailConfirmationUseCase } from '../../application/useCases/emailConfirmation.use-case';
import { LoginUseCase } from '../../application/useCases/login.use-case';
import { RecoveryPasswordUseCase } from '../../application/useCases/recoveryPassword.use-case';
import { NewPasswordUseCase } from '../../application/useCases/newPassword.use-case';
import { LoginOutputModel } from './output/login.output.model';
import { UserViewModel } from '../../../users/api/models/output/createdUser.output.model';
import { ResendingEmailUseCase } from '../../application/useCases/resendingEmail.use-case';
import { ParamType } from '../../../1_commonTypes/paramType';
import {
  AuthUserType,
  UserType,
} from '../../../users/api/models/types/userType';
import { RefreshTokenGuard } from '../../../../infrastructure/guards/refreshToken.guard';
import { UpdateRefreshTokenUseCase } from '../../application/useCases/update-refresh-token.use-case';
import { DeleteRefreshTokenUseCase } from '../../application/useCases/delete-refresh-token.use-case';

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
    private registrationUseCase: RegistrationUseCase,
    private emailConfirmation: EmailConfirmationUseCase,
    private loginUseCase: LoginUseCase,
    private recoveryPasswordUseCase: RecoveryPasswordUseCase,
    private newPasswordUseCase: NewPasswordUseCase,
    private resendingEmailUseCase: ResendingEmailUseCase,
    private refreshTokenUseCase: UpdateRefreshTokenUseCase,
    private deleteRefreshTokenUseCase: DeleteRefreshTokenUseCase,
  ) {}

  @Post(authEndPoints.REGISTRATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(
    @Body() body: UserInputModel,
  ): Promise<UserViewModel | void> {
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

  @UseGuards(AuthGuard)
  @Post(authEndPoints.LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request,
               @Res({ passthrough: true }) res: Response) {
    await this.deleteRefreshTokenUseCase.execute(req)
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
    if (!req.user) {
      throw new UnauthorizedException('password or login or password');
    }
    const dataUser: UserType = {
      email: req.user.email,
      login: req.user.login,
      userId: req.user.userId,
      deviceId: req.user.deviceId,
    };

    const tokens = await  this.refreshTokenUseCase.execute(req, dataUser)

    const accessToken = {
      accessToken: tokens.accessToken,
    };

    res.cookie('refreshToken', tokens.refreshToken, {
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
