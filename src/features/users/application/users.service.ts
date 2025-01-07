import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModel } from '../api/models/input/createUser.input.model';
import {
  ObjectResult,
  ResultStatus
} from '../../../infrastructure/utils/objectResult';
import { UserViewModel } from '../api/models/output/createdUser.output.model';
import { RegistrationUserType } from '../api/models/types/userType';
import { newUser } from '../../../infrastructure/utils/newUser';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {
  }

  async createUser(dto: UserInputModel): Promise<ObjectResult<UserViewModel>> {
    const {login, email, password} = dto
    const isUnique = await this.userRepository.uniqueUser(dto.login, dto.email);
    if (isUnique.length > 0) throw new BadRequestException(isUnique);
    const user: RegistrationUserType = await newUser(login, email,password, )
    console.log('user serv', user);
    const createdUser = await this.userRepository.createUser(user);
    return {
      status: ResultStatus.Success,
      data: createdUser
    };
  }


  async deleteUser(id: string) {
    return await this.userRepository.deleteUser(id);
  }
}
