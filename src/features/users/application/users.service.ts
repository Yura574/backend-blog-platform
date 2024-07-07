import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModel } from '../api/models/input/createUser.input.model';
import {
  ObjectResult,
  ResultStatus,
} from '../../../infrastructure/utils/objectResult';
import { UserViewModel } from '../api/models/output/createdUser.output.model';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async createUser(dto: UserInputModel): Promise<ObjectResult<UserViewModel>> {

    const user = await this.userRepository.createUser(dto);
    return {
      status: ResultStatus.Success,
      data: user,
    };
  }


  async deleteUser(id: string) {
    return await this.userRepository.deleteUser(id);
  }
}
