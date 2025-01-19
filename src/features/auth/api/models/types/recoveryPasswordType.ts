import { HydratedDocument } from 'mongoose';

export type RecoveryPasswordType = {
  recoveryCode: string
  email: string
  expirationDate: Date
}


export type RecoveryPasswordDocType  =  HydratedDocument<RecoveryPasswordType>

export type NewPasswordType = {
  recoveryCode: string
  newPassword: string
}