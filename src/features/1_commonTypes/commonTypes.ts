import { Request } from 'express';
import { UserType } from '../users/api/models/types/userType';
// type UserType = {
//   id: string
//   email: string
//   login: string
//   deviceId?: string
// }

export type RequestType<P, B, Q> = Request<P, {}, B, Q> & { user?:UserType}