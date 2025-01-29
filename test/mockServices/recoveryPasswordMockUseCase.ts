import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { EmailService } from '../../src/features/auth/application/email.service';
import { UsersRepository } from '../../src/features/users/infrastructure/users.repository';
import { RecoveryPasswordService } from '../../src/features/auth/application/recoveryPassword.service';


@Injectable()
export class RecoveryPasswordMockUseCase {
  constructor(private emailService: EmailService,
              private userRepository: UsersRepository,
              private recoveryPasswordService: RecoveryPasswordService,) {
  }
  async execute( email: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) throw new BadRequestException('email not found');
    try {
      const recoveryCode = 'code for test';
      await this.emailService.sendEmailForRecoveryPassword(email, recoveryCode);
      await this.recoveryPasswordService.addUserRecoveryPassword(email, recoveryCode);
      return true;
    } catch (err) {
      console.log(err);
    }
  }
}