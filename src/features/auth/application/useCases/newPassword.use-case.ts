import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { RecoveryPasswordDocType } from '../../api/models/types/recoveryPasswordType';
import { hashPassword } from '../../../../infrastructure/utils/hashPassword';
import { NewPasswordInputModel } from '../../api/models/input/newPassword.input.model';
import { RecoveryPasswordService } from '../recoveryPassword.service';


@Injectable()
export class NewPasswordUseCase {
  constructor(private userRepository: UsersRepository,
              private recoveryPasswordService: RecoveryPasswordService) {
  }

  async execute(data: NewPasswordInputModel) {
    const { newPassword, recoveryCode } = data;
    const [email, code] = recoveryCode.split('_');
    const recoveryPassword: RecoveryPasswordDocType | null = await this.recoveryPasswordService.getUserRecoveryPassword(code);
    if (!recoveryPassword) {
      throw new BadRequestException('recovery code not found');
    }
    if (new Date() > recoveryPassword.expirationDate) {
      throw new BadRequestException('The recovery code has expired');
    }
    const hash = await hashPassword(newPassword);
    await this.recoveryPasswordService.deleteUserRecoveryPassword(recoveryCode);

    return await this.userRepository.updatePasswordUser(hash, email);
  }
}