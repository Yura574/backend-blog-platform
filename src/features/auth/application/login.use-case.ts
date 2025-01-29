import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailConfirmationType, FindUserType } from '../../users/api/models/types/userType';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { EmailService } from './email.service';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


@Injectable()
export class LoginUseCase {
  constructor(private emailService: EmailService,
              private userRepository: UsersRepository) {
  }
  async execute( loginOrEmail: string, password: string) {
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
      refreshCookie: jwt.sign(refreshPayload, process.env.REFRESH_SECRET as string, { expiresIn: '20m'  }, )

    };


    return cookies;
  }
}