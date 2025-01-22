import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserInputModel } from '../../users/api/models/input/createUser.input.model';
import { ErrorMessageType } from '../../../infrastructure/exception-filters/exeptions';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import {
  EmailConfirmationType,
  FindUserType,
  RegistrationUserType,
} from '../../users/api/models/types/userType';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import bcrypt from 'bcrypt';
import { newUser } from '../../../infrastructure/utils/newUser';
import jwt from 'jsonwebtoken';
import { RecoveryPasswordService } from './recoveryPassword.service';
import {
  NewPasswordType,
  RecoveryPasswordDocType,
} from '../api/models/types/recoveryPasswordType';
import { hashPassword } from '../../../infrastructure/utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(private userRepository: UsersRepository,
              private recoveryPasswordService: RecoveryPasswordService,
              private emailService: EmailService) {
  }

  async registration(data: UserInputModel) {
    const { login, email, password } = data;
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

  async confirmEmail( confirmCode: string) {
    const [email, code] = confirmCode.split('_')

    const findUser: FindUserType | null = await this.userRepository.findUser(email);
    if (!findUser) {
      throw new BadRequestException({ message: 'invalid code', field: "code" })
    }
    if (findUser && findUser.emailConfirmation.isConfirm) {
      throw new BadRequestException({ message: 'email already confirmed', field: "code" });
    }
    const { expirationDate, confirmationCode } = findUser.emailConfirmation;
    if (new Date() > expirationDate) {
      const codeForConfirm = v4();
      const sendEmail = await this.emailService.sendMailConfirmation(email, codeForConfirm);
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
      console.log('ererre');
      await this.userRepository.updateEmailConfirmationUser(email, emailConfirmation);
      throw new BadRequestException('The confirmation code has been sent again, check your email and try again');
    }
    console.log(code);
    if (confirmationCode !== code) {

      throw new BadRequestException({ message: 'invalid code', field: "code" });
    }
    const emailConfirmation: EmailConfirmationType = {
      confirmationCode: findUser.emailConfirmation.confirmationCode,
      expirationDate: findUser.emailConfirmation.expirationDate,
      isConfirm: true
    };
    return await this.userRepository.updateEmailConfirmationUser(email, emailConfirmation);


  }

  async login(loginOrEmail: string, password: string) {
    const user: FindUserType | null = await this.userRepository.findUser(loginOrEmail);
    if (!user) {
      throw new UnauthorizedException('If the password or login or email is wrong');
    }
    if (!user.emailConfirmation.isConfirm) {
      throw new ForbiddenException('Confirmed our email');
    }
    const isCompare = await bcrypt.compare(password, user.password);

    if (!isCompare) {
      throw new UnauthorizedException('password or login or email is wrong');
    }
    console.log(user);

    const accessPayload = {
      userId: user._id.toString(),
      email: user.email,
      login: user.login,
      deviceId: v4()
    };
    const refreshPayload = {
      userId: user._id.toString(),
      email: user.email,
      login: user.login,
      deviceId: v4()
    };
    const cookies = {
      accessCookie: jwt.sign(accessPayload, process.env.ACCESS_SECRET as string, { expiresIn: '10m' }),
      refreshCookie: jwt.sign(refreshPayload, process.env.REFRESH_SECRET as string, { expiresIn: '20m' })

    };


    return cookies;
  }

  async recoveryPassword(email: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) throw new BadRequestException('email not found');
    try {
      const recoveryCode = v4();
      await this.emailService.sendEmailForRecoveryPassword(email, recoveryCode);
      await this.recoveryPasswordService.addUserRecoveryPassword(email, recoveryCode);
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async newPassword(data: NewPasswordType, email: string) {
    const { newPassword, recoveryCode } = data;
    const recoveryPassword: RecoveryPasswordDocType | null = await this.recoveryPasswordService.getUserRecoveryPassword(recoveryCode);
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

  async resendingEmail(email: string) {
    const user = await this.userRepository.findUser(email)
    if(!user) throw new BadRequestException([{ message: 'user not found', field: 'email' }])
    if(user && user.emailConfirmation.isConfirm){
      throw new BadRequestException({ message: 'email already confirm', field: "email" })
    }
    const codeForConfirm = v4();
    const isRecoveryCode = await this.recoveryPasswordService.getUserRecoveryPasswordByEmail(email)
    if(isRecoveryCode){
      await this.recoveryPasswordService.deleteUserRecoveryPassword(isRecoveryCode.recoveryCode)
    }
    try {
      await this.emailService.sendMailConfirmation(email, codeForConfirm);
      await this.recoveryPasswordService.addUserRecoveryPassword(email, codeForConfirm)
      return
    } catch (err){
      console.log(err);
    }
  }

  async me (){

  }
}