import { Injectable } from '@nestjs/common';
import { UserDeviceInfo } from '../domain/userDeviceInfo.entity';
import { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDeviceInfoDto } from '../api/types/createUserDeviceInfoDto';

@Injectable()
export class UserDeviceInfoRepository {
  constructor(
    @InjectModel(UserDeviceInfo.name) private userDeviceInfoModel: Model<UserDeviceInfo>,
  ) {}

  async addUserDeviceInfo(dto: CreateUserDeviceInfoDto) {
    const { deviceId, deviceName, userId, refreshToken } = dto;
    try {
      const findDevice = await this.userDeviceInfoModel.findOne({
        deviceId: dto.deviceId,
      });
      if (findDevice) {
        await this.userDeviceInfoModel.updateOne({
          refreshToken,
          lastActiveDate: new Date().toISOString(),
        });
        return;
      }
      console.log(dto);
      await this.userDeviceInfoModel.create(dto);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteDeviceId(deviceId: string) {
    try {
      return await this.userDeviceInfoModel.deleteOne({
        deviceId
      });
    } catch (error) {
      console.log(error);
    }
  }
}
