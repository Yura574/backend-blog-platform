import { JwtPayload } from 'jsonwebtoken';


export type JwtPayloadType = JwtPayload & {
  userId: string
  login: string
  email: string
}