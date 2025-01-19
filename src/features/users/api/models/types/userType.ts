import { HydratedDocument, ObjectId } from 'mongoose';

export type UserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UpdateUserType = {
  id: string;
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
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string,
    expirationDate: Date,
    isConfirm: boolean
  }
}
export type FindUserType = HydratedDocument<FindUser>
