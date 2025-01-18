import { RegistrationUserType } from '../../features/users/api/models/types/userType';
import { add } from 'date-fns';
import { hashPassword } from './hashPassword';
import  { v4 } from 'uuid';


export const newUser = async (login: string, email: string, password: string, codeForConfirm: string ='', isConfirm: boolean = false)=> {
  const hash = await hashPassword(password)
  const user: RegistrationUserType = {
    login,
    email,
    password: hash,
    createdAt: new Date().toISOString(),
    emailConfirmation: {
      confirmationCode: codeForConfirm,
      expirationDate: add(new Date(), {
        hours: 1, minutes: 10
      }),
      isConfirm
    }
  }
  return user
}