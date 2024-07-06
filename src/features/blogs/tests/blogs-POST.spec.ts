import { Test } from '@nestjs/testing';
import { UserController } from '../../users/api/user.controller';
import { UsersService } from '../../users/application/users.service';


describe('blogs-post', () => {
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();
  });
});