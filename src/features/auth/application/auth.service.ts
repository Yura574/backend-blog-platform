import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../infractructure/auth.repository';
import { EmailService } from './email.service';
import { UserInputModel } from '../../users/api/models/input/createUser.input.model';
import { ErrorMessageType } from '../../../infrastructure/exception-filters/exeptions';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { RegistrationUserType, UserType } from '../../users/api/models/types/userType';
import uuid, { v4 } from 'uuid';
import { add } from 'date-fns';
import bcrypt from 'bcrypt';
import { newUser } from '../../../infrastructure/utils/newUser';


@Injectable()
export class AuthService {
  constructor(private userRepository: UsersRepository,
              // private userService
              private emailService: EmailService) {
  }

  async registration(data: UserInputModel){
    const {login, email, password} = data
    const isUnique: ErrorMessageType[] = await this.userRepository.uniqueUser(login, email);
    if (isUnique.length > 0) throw new BadRequestException(isUnique);
    const codeForConfirm = v4()
   const sendEmail =  await this.emailService.sendMailConfirmation(email, codeForConfirm)
    if(!sendEmail){
     throw new BadRequestException('email not send');
    }
    const user: RegistrationUserType = await newUser(login,email, password)
    return  await this.userRepository.createUser(user)
  }
}