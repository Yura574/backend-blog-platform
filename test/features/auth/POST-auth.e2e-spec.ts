import { clearDatabase, closeTest, initializeTestSetup, testApp, TestSetup } from '../../../test-setup';
import { UsersTestManagers } from '../../testManagers/usersTestManagers';
import { UserInputModel } from '../../../src/features/users/api/models/input/createUser.input.model';
import request from 'supertest';


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
      email: 'yura5742248@gmail.com',
      login: 'yura22',
      password: '123456'
    }
    const result = await request(testApp.getHttpServer())
      .post('/auth/registration')
      .send(dto)
      console.log(result.body);
  })

})