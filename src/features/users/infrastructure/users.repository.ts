import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/user.entity';
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
      const { id, email, login, createdAt } = user;
      return { id, login, email , createdAt};
    } catch (err) {
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

  async findUser(emailOrLogin: string) {

    return  this.userModel.findOne({
      $or: [
        { login: { $regex: emailOrLogin } },
        { email: { $regex: emailOrLogin } }
      ]
    });
  }

  async updateEmailConfirmationUser(email: string, emailConfirmation: EmailConfirmationType) {
    const user: FindUserType | null = await this.findUser(email);
    return this.userModel.updateOne({ email: user?.email }, {
      emailConfirmation: emailConfirmation
    });
  }

  async updatePasswordUser(password: string, email: string) {
    return this.userModel.updateOne({ email }, { password });
  }

  async deleteUser(id: string) {
      return   this.userModel.deleteOne({ _id: id });
  }

}
