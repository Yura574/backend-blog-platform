import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import * as process from 'node:process';
import { JwtPayloadType } from '../../features/1_commonTypes/jwtPayloadType';
import { RequestType } from '../../features/1_commonTypes/commonTypes';

const login1 = 'admin'
const password1 = 'qwerty'

@Injectable()
export class GetUserDataGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestType<any, any, any>>();
    const auth = request.headers['authorization'];
    if (!auth) return true

    const [type, token] = auth.split(' ');
    if (type === 'Bearer') {
      try {
        const payload = jwt.verify(token, process.env.ACCESS_SECRET  as string) as JwtPayloadType;
        request.user = {
          userId: payload.userId,
          login: payload.login,
          email: payload.email,
          deviceId: payload.deviceId,
        };
        return true
      } catch (err) {
        return  true
      }

    }
    return true;
  }


}
