import { Request } from 'express';
type UserType = {
  userId: string
  email: string
  login: string
}

export type RequestType<P, B, Q> = Request<P, {}, B, Q> & { user?:UserType}