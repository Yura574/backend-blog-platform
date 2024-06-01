import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../api/models/input/createUser.input.model';
import {
  ObjectResult,
  ResultStatus,
} from '../../../infrastructure/utils/objectResult';
import { CreatedUser } from '../api/models/output/createdUser.output.model';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<ObjectResult<CreatedUser>> {
    return {
      status: ResultStatus.Success,
      data: { cratedAt: '', email: '', login: '', id: '' },
    };
  }
}
