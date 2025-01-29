import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailService } from '../email.service';
import { UserInputModel } from '../../../users/api/models/input/createUser.input.model';
import { ErrorMessageType } from '../../../../infrastructure/exception-filters/exeptions';
import { v4 } from 'uuid';
import { newUser } from '../../../../infrastructure/utils/newUser';
import { RegistrationUserType } from '../../../users/api/models/types/userType';

@Injectable()
export class RegistrationUseCase {
  constructor(private userRepository: UsersRepository,
              private emailService: EmailService) {
  }

  async execution(data: UserInputModel) {
    const { login, email, password } = data;
    console.log(data);
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
}