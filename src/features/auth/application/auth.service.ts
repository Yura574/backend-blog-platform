import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../infractructure/auth.repository';
import { EmailService } from './email.service';
import { UserInputModel } from '../../users/api/models/input/createUser.input.model';
import { ErrorMessageType } from '../../../infrastructure/exception-filters/exeptions';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import {
  EmailConfirmationType,
  FindUserType,
  RegistrationUserType,
  UserType
} from '../../users/api/models/types/userType';
import uuid, { v4 } from 'uuid';
import { add } from 'date-fns';
import bcrypt from 'bcrypt';
import { newUser } from '../../../infrastructure/utils/newUser';
import { ConfirmEmailType } from '../../blogs/api/model/types/confirmEmailType';
import { UsersService } from '../../users/application/users.service';


@Injectable()
export class AuthService {
  constructor(private userRepository: UsersRepository,
              private userService: UsersService,
              private emailService: EmailService) {
  }

  async registration(data: UserInputModel) {
    const { login, email, password } = data;
    const isUnique: ErrorMessageType[] = await this.userRepository.uniqueUser(login, email);
    if (isUnique.length > 0) throw new BadRequestException(isUnique);
    const codeForConfirm = v4();
    const sendEmail = await this.emailService.sendMailConfirmation(email, codeForConfirm);
    if (!sendEmail) {
      throw new BadRequestException('email not send');
    }
    const user: RegistrationUserType = await newUser(login, email, password, codeForConfirm);
    return await this.userRepository.createUser(user);
  }

  async confirmEmail(email: string, code: string) {

    const findUser: FindUserType | null = await this.userRepository.findUser(email);
    if (!findUser) {
      return false;
    }
    console.log(findUser);
    if(findUser && findUser.emailConfirmation.isConfirm){
      return 'email already confirmed'
    }
    const {expirationDate, confirmationCode} = findUser.emailConfirmation
    if(new Date() >  expirationDate ){
      const codeForConfirm = v4();
      const sendEmail = await this.emailService.sendMailConfirmation(email, codeForConfirm);
      if (!sendEmail) {
        throw new BadRequestException('email not send');
      }
      const emailConfirmation: EmailConfirmationType = {
        confirmationCode: codeForConfirm,
        expirationDate: add(new Date(), {
          hours: 1, minutes: 10
        }),
        isConfirm: false
      }
      console.log('ererre');
      await this.userRepository.updateEmailConfirmationUser(email, emailConfirmation)
      throw new BadRequestException('The confirmation code has been sent again, check your email and try again')
    }

    if(confirmationCode !== code){

      throw new BadRequestException('incorrect confirmation code ')
    }
    const emailConfirmation: EmailConfirmationType = {
      confirmationCode: findUser.emailConfirmation.confirmationCode,
      expirationDate: findUser.emailConfirmation.expirationDate,
      isConfirm: true
    }
    return await this.userRepository.updateEmailConfirmationUser(email, emailConfirmation)



  }
}