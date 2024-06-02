import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../api/models/input/createUser.input.model';
import {
  ObjectResult,
  ResultStatus,
} from '../../../infrastructure/utils/objectResult';
import { UserViewModel } from '../api/models/output/createdUser.output.model';
import { QueryUsersType } from '../api/models/types/queryTypes';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<ObjectResult<UserViewModel>> {
    console.log(typeof dto.login);
    console.log(dto.password);
    const user = await this.userRepository.createUser(dto);
    return {
      status: ResultStatus.Success,
      data: user,
    };
  }
}
