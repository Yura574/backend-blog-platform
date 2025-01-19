import { Injectable } from '@nestjs/common';
import { RecoveryPasswordRepository } from '../infractructure/recoveryPassword.repository';
import { RecoveryPasswordType } from '../api/models/types/recoveryPasswordType';
import { add } from 'date-fns';


@Injectable()
export class RecoveryPasswordService {
  constructor(private recoveryPasswordRepository: RecoveryPasswordRepository) {
  }


  async addUserRecoveryPassword(email: string, recoveryCode: string) {
    const data: RecoveryPasswordType = {
      email,
      recoveryCode,
      expirationDate: add(new Date(), { minutes: 10 })
    };
    return await this.recoveryPasswordRepository.addUserRecoveryPassword(data);
  }

  async getUserRecoveryPassword(recoveryCode: string) {
    return await this.recoveryPasswordRepository.getUserRecoveryPassword(recoveryCode)
  }

  async getUserRecoveryPasswordByEmail(email: string) {
    return await this.recoveryPasswordRepository.getUserRecoveryPasswordByEmail(email)
  }

  async deleteUserRecoveryPassword(recoveryCode: string) {
    return await this.recoveryPasswordRepository.deleteUserRecoveryPassword(recoveryCode)
  }
}