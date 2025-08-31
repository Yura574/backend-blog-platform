import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { FindUserType, UserType } from '../../users/api/models/types/userType';

export const createPairTokens =(user:  UserType )=>{


  const accessPayload = {
    userId: user.userId.toString(),
    email: user.email,
    login: user.login,
    deviceId: v4()
  };
  const refreshPayload = {
    userId: user.userId.toString(),
    email: user.email,
    login: user.login,
    deviceId: user.deviceId? user.deviceId : v4()
  };
  return   {
    accessCookie: jwt.sign(accessPayload, process.env.ACCESS_SECRET as string, { expiresIn: process.env.ACCESS_EXPIRES }),
    refreshCookie: jwt.sign(refreshPayload, process.env.REFRESH_SECRET as string, { expiresIn: process.env.REFRESH_EXPIRES }),

  };
}