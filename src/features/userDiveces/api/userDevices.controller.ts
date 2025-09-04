import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserDeviceInfoService } from '../aplication/userDeviceInfo.service';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { RequestType } from '../../1_commonTypes/commonTypes';
import { ParamType } from '../../1_commonTypes/paramType';

@Controller('security')
export class UserDevicesController {
  constructor(private userDevicesService: UserDeviceInfoService) {}

  @UseGuards(AuthGuard)
  @Get('devices')
  @HttpCode(200)
  async getUserDevices(@Req() req: RequestType<ParamType, {}, {}>) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.userDevicesService.findAllUserDevices(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(`devices/:id`)
  @HttpCode(204)
  async deleteUserDeviceById(@Req() req: RequestType<ParamType, {}, {}>) {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    return await this.userDevicesService.deleteDeviceId(req.params.id);
  }

  @UseGuards(AuthGuard)
  @Delete('devices')
  @HttpCode(204)
  async deleteUserDevices(@Req() req: RequestType<ParamType, {}, {}>) {
    const deviceId = req.user?.deviceId;
    if (!deviceId) throw new UnauthorizedException();
    return await this.userDevicesService.deleteUserDevices(deviceId);
  }
}
