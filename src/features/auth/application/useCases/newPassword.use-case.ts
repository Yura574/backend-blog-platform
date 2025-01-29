import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { EmailService } from '../email.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { FindUserType } from '../../../users/api/models/types/userType';
import { RecoveryPasswordDocType } from '../../api/models/types/recoveryPasswordType';
import { hashPassword } from '../../../../infrastructure/utils/hashPassword';
import { NewPasswordInputModel } from '../../api/models/input/newPassword.input.model';
import { RecoveryPasswordService } from '../recoveryPassword.service';


@Injectable()
export class NewPasswordUseCase {
  constructor(private emailService: EmailService,
              private userRepository: UsersRepository,
              private recoveryPasswordService: RecoveryPasswordService) {
  }
  async execute(data: NewPasswordInputModel) {
    const { newPassword, recoveryCode } = data;
    const [email, code] = recoveryCode.split('_')
    const recoveryPassword: RecoveryPasswordDocType | null = await this.recoveryPasswordService.getUserRecoveryPassword(code);
    if (!recoveryPassword) {
      throw new BadRequestException('recovery code not found');
    }
    // const getCode = await this.recoveryPasswordService.getUserRecoveryPassword()
    if (new Date() > recoveryPassword.expirationDate) {
      throw new BadRequestException('The recovery code has expired');
    }
    const hash = await hashPassword(newPassword);
    await this.recoveryPasswordService.deleteUserRecoveryPassword(recoveryCode);

    return await this.userRepository.updatePasswordUser(hash, email);
  }
}