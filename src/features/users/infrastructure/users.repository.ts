import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { EmailConfirmation, User, UserDocument } from '../domain/user.entity';
import { UserViewModel } from '../api/models/output/createdUser.output.model';
import { ErrorMessageType } from '../../../infrastructure/exception-filters/exeptions';
import { EmailConfirmationType, FindUserType, RegistrationUserType } from '../api/models/types/userType';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async createUser(dto: RegistrationUserType): Promise<UserViewModel> {

    try {
      const createdUser = await this.userModel.create(dto);
      const user = await createdUser.save();
      const { id, email, login } = user;
      return { id, login, email };
    } catch (err) {
      console.log(err);
      throw new HttpException('Login or email already exist', HttpStatus.BAD_REQUEST);
    }
  }

  async uniqueUser(login: string, email: string) {
    const errors: ErrorMessageType[] = [];
    const userEmail = await this.userModel.findOne({ email: { $regex: email } });
    if (userEmail) {
      errors.push({ field: 'email', message: 'email already exist' });
    }

    const userLogin = await this.userModel.findOne({ login: { $regex: login } });
    if (userLogin) {
      errors.push({ field: 'login', message: 'login already exist' });
    }

    return errors;
  }

  async findUser(email: string) {
    const errors: ErrorMessageType[] = [];
    const userEmail = await this.userModel.findOne({ email: { $regex: email } });
    if (!userEmail) {
      errors.push({ field: 'email', message: 'email not found' });
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return userEmail;
  }

  async updateEmailConfirmationUser(email: string, emailConfirmation: EmailConfirmationType) {
    const user: FindUserType | null = await this.findUser(email);
    return this.userModel.updateOne({ email: user?.email}, {
      emailConfirmation: emailConfirmation
    });
  }

  async deleteUser(id: string) {
    try {
      const result = await this.userModel.deleteOne({ _id: id });
      if (!result.deletedCount) {
        throw new NotFoundException('User not found');

      }
      return result;
    } catch (err) {
      throw new NotFoundException();
    }
  }

}
