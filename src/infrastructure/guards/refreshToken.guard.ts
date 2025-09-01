import {
    CanActivate,
    ExecutionContext,
    Injectable, UnauthorizedException,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import jwt from 'jsonwebtoken';
import * as process from 'node:process';
import {JwtPayloadType} from '../../features/1_commonTypes/jwtPayloadType';
import {RequestType} from '../../features/1_commonTypes/commonTypes';


@Injectable()
export class RefreshTokenGuard implements CanActivate {
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<RequestType<any, any, any>>();
        const refreshToken = request.cookies['refreshToken']
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as JwtPayloadType;
            request.user = {
                userId: payload.userId,
                login: payload.login,
                email: payload.email,
                deviceId: payload.deviceId
            };
            return true
        } catch (err) {
            throw new UnauthorizedException()





        }


    }
}
