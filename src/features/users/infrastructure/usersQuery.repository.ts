import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { Model } from 'mongoose';
import { QueryUsersType } from '../api/models/types/queryTypes';
import { UserType } from '../api/models/types/userType';
import { ReturnViewModel } from '../../1_commonTypes/returnViewModel';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
  }

  async getUsers(param: QueryUsersType): Promise<ReturnViewModel<UserType[]>> {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
      searchEmailTerm = '',
      searchLoginTerm = ''
    } = param;

    const searchConditions: any = [];
    if (searchLoginTerm) {
      searchConditions.push({
        login: { $regex: new RegExp(searchLoginTerm, 'i') }
      });
    }

    if (searchEmailTerm) {
      searchConditions.push({
        email: { $regex: new RegExp(searchEmailTerm, 'i') }
      });
    }

    const searchQuery =
      searchConditions.length > 0 ? { $or: searchConditions } : {};

    const totalCount = await this.userModel.countDocuments(searchQuery);

    const pagesCount = Math.ceil(totalCount / +pageSize);
    const skip = (+pageNumber - 1) * +pageSize;

    const sort: any = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
    const users = await this.userModel
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(+pageSize);
    const mappedUser: UserType[] = users.map((user) => {
      return {
        id: user.id.toString(),
        login: user.login,
        email: user.email,
        createdAt: new Date(user.createdAt).toISOString()
      };
    });
    return {
      pagesCount,
      pageSize,
      totalCount,
      page: pageNumber,
      items: mappedUser
    };
  }

  async getUserById(userId: string) {

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      ...user,
      id: user.id.toString()
    };

  }
}
