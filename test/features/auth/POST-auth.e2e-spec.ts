import { clearDatabase, closeTest, initializeTestSetup, testApp, TestSetup } from '../../../test-setup';
import { UsersTestManagers } from '../../testManagers/usersTestManagers';
import { UserInputModel } from '../../../src/features/users/api/models/input/createUser.input.model';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';


describe('test for POST auth', ()=> {
  let userTestManager: UsersTestManagers
  beforeAll(async ()=>{
    await initializeTestSetup()
    userTestManager = new UsersTestManagers(testApp)
  })
  beforeEach(async ()=> {
   await clearDatabase()
  })

  afterAll(async ()=> {
    await closeTest()
  })

  it('registration user', async ()=> {
    const dto: UserInputModel = {
      email: 'yura@gmail.com',
      login: 'yura',
      password: '123456'
    }
    const result = await request(testApp.getHttpServer())
      .post('/auth/registration')
      .send(dto)
  })

})