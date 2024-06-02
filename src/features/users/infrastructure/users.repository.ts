import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { CreateUserDto } from '../api/models/input/createUser.input.model';
import { UserViewModel } from '../api/models/output/createdUser.output.model';
import { hashPassword } from '../../../infrastructure/utils/hashPassword';
import { QueryUsersType } from '../api/models/types/queryTypes';
import { ReturnViewModel } from '../../commonTypes/returnViewModel';
import { UserType } from '../api/models/types/userType';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto): Promise<UserViewModel> {
    const hash = await hashPassword(dto.password);
    const createdUser = await this.userModel.create({
      ...dto,
      password: hash,
    });
    const user = await createdUser.save();
    const { id, createdAt, email, login } = user;
    return { id, login, email, createdAt };
  }
}
