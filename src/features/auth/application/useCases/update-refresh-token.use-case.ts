import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt, { hash } from 'bcrypt';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import {
  FindUserType,
  UserType,
} from '../../../users/api/models/types/userType';
import { createPairTokens } from '../../utils/createPairTokens';
import { UserDeviceInfoService } from '../../../userDiveces/aplication/userDeviceInfo.service';
import { v4 } from 'uuid';
import { RequestType } from '../../../1_commonTypes/commonTypes';
import jwt from 'jsonwebtoken';
import { JwtPayloadType } from '../../../1_commonTypes/jwtPayloadType';
import { Request } from 'express';

@Injectable()
export class UpdateRefreshTokenUseCase {
  constructor(private userDeviceInfoService: UserDeviceInfoService) {}

  async execute(req: RequestType<any, any, any>, dataUser: UserType) {
    const refreshToken = req.cookies['refreshToken'];
    const payload = jwt.decode(refreshToken) as JwtPayloadType;
    const findTokenDevice = await this.userDeviceInfoService.findUserDeviceInfo(
      payload.deviceId,
    );
    if (!findTokenDevice) {
      throw new UnauthorizedException();
    }
    const isCompare = await bcrypt.compare(
      refreshToken,
      findTokenDevice.refreshToken,
    );

    if (!isCompare) {
      throw new UnauthorizedException();
    }
    const tokens = createPairTokens(dataUser);
    await this.userDeviceInfoService.addUserDeviceInfo(
      req,
      dataUser,
      tokens.refreshToken,
    );



    return tokens;
  }
}
