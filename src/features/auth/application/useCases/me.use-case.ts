import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import {
  FindUserType,
  UserType,
} from '../../../users/api/models/types/userType';
import bcrypt from 'bcrypt';
import { createPairTokens } from '../../utils/createPairTokens';

@Injectable()
export class MeUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(user: UserType) {
    const findUser: FindUserType | null = await this.userRepository.findUser(
      user.login,
    );

    if (!findUser) throw new UnauthorizedException();

    const dataUser: UserType = {
      email: findUser.email,
      login: findUser.login,
      userId: findUser._id.toString(),
    };
    return createPairTokens(dataUser);
  }
}
