import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import * as process from 'node:process';
import { JwtPayloadType } from '../../features/1_commonTypes/jwtPayloadType';
import { RequestType } from '../../features/1_commonTypes/commonTypes';
import { UserDeviceInfoService } from '../../features/userDiveces/aplication/userDeviceInfo.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private userDeviceInfo: UserDeviceInfoService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestType<any, any, any>>();
    // console.log(123);
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException();
    let payload: JwtPayloadType
    try {
       payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET as string,
      ) as JwtPayloadType;

      request.user = {
        userId: payload.userId,
        login: payload.login,
        email: payload.email,
        deviceId: payload.deviceId,
      };


    } catch (err) {
      throw new UnauthorizedException();
    }
    const device = await this.userDeviceInfo.findUserDeviceInfo(payload.deviceId);
    if (!device) throw new UnauthorizedException();
    return true;
  }
}
