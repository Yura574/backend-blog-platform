import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../infractructure/auth.repository';
import { EmailService } from './email.service';
import { UserInputModel } from '../../users/api/models/input/createUser.input.model';
import { ErrorMessageType } from '../../../infrastructure/exception-filters/exeptions';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { RegistrationUserType, UserType } from '../../users/api/models/types/userType';
import uuid from 'uuid'
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
    if (isUnique) throw new BadRequestException(isUnique);

    const user: RegistrationUserType = await newUser(login,email, password)
    await this.userRepository.createUser(user)
  }
}