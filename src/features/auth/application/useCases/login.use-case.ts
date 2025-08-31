import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import {
  FindUserType,
  UserType,
} from '../../../users/api/models/types/userType';
import { createPairTokens } from '../../utils/createPairTokens';

@Injectable()
export class LoginUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(loginOrEmail: string, password: string) {
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
    // console.log('user id', user.id);

    const dataUser: UserType = {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    };
    return createPairTokens(dataUser);
  }
}
