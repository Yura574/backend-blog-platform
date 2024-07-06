import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { CreateUserDto } from '../api/models/input/createUser.input.model';
import { UserViewModel } from '../api/models/output/createdUser.output.model';
import { hashPassword } from '../../../infrastructure/utils/hashPassword';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async createUser(dto: CreateUserDto): Promise<UserViewModel> {
   try{
     const hash = await hashPassword(dto.password);
     const createdUser = await this.userModel.create({
       ...dto,
       createdAt: new Date().toISOString(),
       password: hash
     });
     const user = await createdUser.save();
     const { id, createdAt, email, login } = user;
     return { id, login, email, createdAt };
   } catch (err){
     throw new HttpException('Login or password already exist', HttpStatus.BAD_REQUEST)
   }
  }

  async deleteUser(id: string) {
    try{
      const result = await this.userModel.deleteOne({ _id: id });
      if (!result.deletedCount) {
        throw new NotFoundException('User not found');
      }
      return result;
    } catch (err){
      throw new NotFoundException()
    }
    }

}
