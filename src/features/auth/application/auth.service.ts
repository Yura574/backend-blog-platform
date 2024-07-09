import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../infractructure/auth.repository';
import { EmailService } from './email.service';
import { UserInputModel } from '../../users/api/models/input/createUser.input.model';


@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository,
              private emailService: EmailService) {
  }

  async registration(body: UserInputModel){

  }
}