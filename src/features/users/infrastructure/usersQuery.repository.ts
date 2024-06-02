import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { Model } from 'mongoose';
import { QueryUsersType } from '../api/models/types/queryTypes';
import { UserType } from '../api/models/types/userType';
import { ReturnViewModel } from '../../commonTypes/returnViewModel';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(param: QueryUsersType): Promise<ReturnViewModel<UserType[]>> {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
      searchEmailTerm = '',
      searchLoginTerm = '',
    } = param;
    const totalCount = await this.userModel.countDocuments({
      $or: [
        {
          login: {
            $regex: searchLoginTerm ? new RegExp(searchLoginTerm, 'i') : ' ',
          },
        },
        {
          email: {
            $regex: searchEmailTerm ? new RegExp(searchEmailTerm, 'i') : ' ',
          },
        },
      ],
    });

    const pagesCount = Math.ceil(totalCount / +pageSize);
    const skip = (+pageNumber - 1) * +pageSize;

    const sort: any = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
    const users = await this.userModel
      .find({
        $or: [
          {
            login: {
              $regex: searchLoginTerm ? new RegExp(searchLoginTerm, 'i') : ' ',
            },
          },
          {
            email: {
              $regex: searchEmailTerm ? new RegExp(searchEmailTerm, 'i') : ' ',
            },
          },
        ],
      })
      .sort(sort)
      .skip(skip)
      .limit(+pageSize);
    console.log(users);
    const mappedUser: UserType[] = users.map((user) => {
      return {
        id: user.id.toString(),
        login: user.login,
        email: user.email,
        createdAt: new Date(user.createdAt).toISOString(),
      };
    });
    return {
      pagesCount,
      pageSize,
      totalCount,
      page: pageNumber,
      items: mappedUser,
    };
  }
}
