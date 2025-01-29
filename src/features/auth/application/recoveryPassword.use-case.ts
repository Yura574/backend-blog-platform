import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailConfirmationType, FindUserType } from '../../users/api/models/types/userType';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { EmailService } from './email.service';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RecoveryPasswordService } from './recoveryPassword.service';


@Injectable()
export class RecoveryPasswordUseCase {
  constructor(private emailService: EmailService,
              private userRepository: UsersRepository,
              private recoveryPasswordService: RecoveryPasswordService,) {
  }
  async execute( email: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) throw new BadRequestException('email not found');
    try {
      const recoveryCode = v4();
      await this.emailService.sendEmailForRecoveryPassword(email, recoveryCode);
      await this.recoveryPasswordService.addUserRecoveryPassword(email, recoveryCode);
      return true;
    } catch (err) {
      throw new BadRequestException('recovery')
    }
  }
}