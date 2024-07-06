import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('testing')
export class AppController {
constructor(private appService: AppService) {
}

@Delete('all-data')
@HttpCode(HttpStatus.NO_CONTENT)
async deleteAllData(){
  return await this.appService.deleteAllData()
}
}