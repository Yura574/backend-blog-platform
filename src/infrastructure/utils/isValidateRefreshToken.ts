import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayloadType } from '../../features/1_commonTypes/jwtPayloadType';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserDeviceInfoService } from '../../features/userDiveces/aplication/userDeviceInfo.service';
import { UserType } from '../../features/users/api/models/types/userType';
import { createPairTokens } from '../../features/auth/utils/createPairTokens';


export const isValidateRefreshToken = async (refreshToken: string, findRefreshToken: string) =>  {


    if (!findRefreshToken) {
      throw new UnauthorizedException();
    }
    const isCompare = await bcrypt.compare(
      refreshToken,
      findRefreshToken,
    );

    if (!isCompare) {
      throw new UnauthorizedException();
    }


}