import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthRepository } from '../../infractructure/auth.repository';
import { UserInputModel } from '../../../users/api/models/input/createUser.input.model';
import { UsersRepository } from '../../../users/infrastructure/users.repository';


@Controller('auth')
export class AuthController {
  constructor(private authRepository: AuthRepository,
              private userRepository: UsersRepository) {
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() body: UserInputModel) {
await this.userRepository.createUser(body)
  }
}