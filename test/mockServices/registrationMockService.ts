import { UsersRepository } from '../../src/features/users/infrastructure/users.repository';
import { EmailService } from '../../src/features/auth/application/email.service';
import { UserInputModel } from '../../src/features/users/api/models/input/createUser.input.model';
import { ErrorMessageType } from '../../src/infrastructure/exception-filters/exeptions';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { RegistrationUserType } from '../../src/features/users/api/models/types/userType';
import { newUser } from '../../src/infrastructure/utils/newUser';

@Injectable()
export class RegistrationMockUseCase {
  constructor(private userRepository: UsersRepository,
              private emailService: EmailService) {
  }

  async execution(data: UserInputModel) {
    const { login, email, password } = data;
    const isUnique: ErrorMessageType[] = await this.userRepository.uniqueUser(login, email);
    if (isUnique.length > 0) throw new BadRequestException(isUnique);
    const codeForConfirm = 'code for test';
    const sendEmail = await this.emailService.sendMailConfirmation(email, codeForConfirm);
    if (!sendEmail) {
      throw new BadRequestException('email not send');
    }
    const user: RegistrationUserType = await newUser(login, email, password, codeForConfirm);
    return await this.userRepository.createUser(user);
  }
}