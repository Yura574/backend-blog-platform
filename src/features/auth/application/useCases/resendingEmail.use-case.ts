import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { EmailService } from '../email.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailConfirmationType, FindUserType } from '../../../users/api/models/types/userType';


@Injectable()
export class ResendingEmailUseCase {
  constructor(private emailService: EmailService,
              private userRepository: UsersRepository) {
  }
    async execute(email: string) {
      const user = await this.userRepository.findUser(email)
      if(!user) throw new BadRequestException([{ message: 'user not found', field: 'email' }])
      if(user.emailConfirmation.isConfirm){
        throw new BadRequestException([{ message: 'email already confirm', field: "email" }])
      }
      const confirmationCode = v4();

      try {
        await this.emailService.sendMailConfirmation(email, confirmationCode);
        const expirationDate = add(new Date(), {hours: 1})
        await this.userRepository.updateEmailConfirmationUser(email, {confirmationCode, expirationDate, isConfirm: false})
        return
      } catch (err){
        console.log(err);
      }
    }
}