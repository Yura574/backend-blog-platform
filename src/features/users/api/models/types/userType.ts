import { HydratedDocument, ObjectId } from 'mongoose';

export type UserType = {
  userId: string;
  login: string;
  email: string;
  // createdAt?: string;
  deviceId?: string;
};

export type AuthUserType = {
  userId: string;
  login: string;
  email: string;
}


export type RegistrationUserType = {
  login: string;
  email: string;
  password: string
  createdAt: string;
  emailConfirmation: EmailConfirmationType
}

export type EmailConfirmationType = {
  confirmationCode: string,
  expirationDate: Date,
  isConfirm: boolean
}
export type FindUser  = {
  login: string;
  email: string;
  password: string
  deviceId?: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string,
    expirationDate: Date,
    isConfirm: boolean
  }
}
export type FindUserType = HydratedDocument<FindUser>
