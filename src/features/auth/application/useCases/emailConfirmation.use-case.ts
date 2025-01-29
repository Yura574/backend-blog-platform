import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { EmailService } from '../email.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailConfirmationType, FindUserType } from '../../../users/api/models/types/userType';


@Injectable()
export class EmailConfirmationUseCase {
  constructor(private emailService: EmailService,
              private userRepository: UsersRepository) {
  }
  async execute( confirmCode: string) {
    const [email, code] = confirmCode.split('_')

    const findUser: FindUserType | null = await this.userRepository.findUser(email.trim());
    if (!findUser) {
      throw new BadRequestException({ message: 'invalid code', field: "code" })
    }
    if (findUser && findUser.emailConfirmation.isConfirm) {
      throw new BadRequestException({ message: 'email already confirmed', field: "code" });
    }
    const { expirationDate, confirmationCode } = findUser.emailConfirmation;
    if (new Date() > expirationDate) {
      const codeForConfirm = v4();
      const sendEmail = await this.emailService.sendMailConfirmation(email.trim(), codeForConfirm);
      if (!sendEmail) {
        throw new BadRequestException('email not send');
      }
      const emailConfirmation: EmailConfirmationType = {
        confirmationCode: codeForConfirm,
        expirationDate: add(new Date(), {
          hours: 1, minutes: 10
        }),
        isConfirm: false
      };
      await this.userRepository.updateEmailConfirmationUser(email.trim(), emailConfirmation);
      throw new BadRequestException('The confirmation code has been sent again, check your email and try again');
    }
    if (confirmationCode !== code.trim()) {

      throw new BadRequestException({ message: 'invalid code', field: "code" });
    }
    const emailConfirmation: EmailConfirmationType = {
      confirmationCode: findUser.emailConfirmation.confirmationCode,
      expirationDate: findUser.emailConfirmation.expirationDate,
      isConfirm: true
    };
    return await this.userRepository.updateEmailConfirmationUser(email, emailConfirmation);


  }
}