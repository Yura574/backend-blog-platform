import {
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

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestType<any, any, any>>();
    const auth = request.headers['authorization'];

    if (!auth) throw new UnauthorizedException();
    const [type, token] = auth.split(' ');
    if (type !== 'Basic' && type !== 'Bearer') throw new UnauthorizedException();

    if (type === 'Bearer') {
      try {
        const payload = jwt.verify(token, process.env.REFRESH_SECRET as string) as JwtPayloadType;
        request.user = {
          userId: payload.userId,
          login: payload.login,
          email: payload.email
        };
      } catch (err) {
        throw new ForbiddenException()
      }

    }

    return true;
  }


}
