import { ForbiddenException, Injectable, UnauthorizedException, } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { FindUserType, UserType, } from '../../../users/api/models/types/userType';
import { createPairTokens } from '../../utils/createPairTokens';
import { UserDeviceInfoService } from '../../../userDiveces/aplication/userDeviceInfo.service';
import { v4 } from 'uuid';
import { RequestType } from '../../../1_commonTypes/commonTypes';

@Injectable()
export class LoginUseCase {
  constructor(
    private userRepository: UsersRepository,
    private userDeviceInfoService: UserDeviceInfoService,
  ) {}

  async execute(loginOrEmail: string, password: string, req: RequestType<{ } , {}, {}>) {
    const user: FindUserType | null = await this.userRepository.findUser(
      loginOrEmail,
    );
    if (!user) {
      throw new UnauthorizedException(
        'If the password or login or email is wrong',
      );
    }
    if (!user.emailConfirmation.isConfirm) {
      throw new ForbiddenException('Confirmed our email');
    }
    const isCompare = await bcrypt.compare(password, user.password);

    if (!isCompare) {
      throw new UnauthorizedException('password or login or email is wrong');
    }


    const dataUser: UserType = {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
      deviceId: v4(),
    };
    const tokens =  createPairTokens(dataUser);
    await this.userDeviceInfoService.addUserDeviceInfo(req,dataUser, tokens.refreshToken )
return tokens
  }
}
