import { Injectable } from '@nestjs/common';
import {
  UserDeviceInfo,
  UserDeviceInfoDocument,
} from '../domain/userDeviceInfo.entity';
import { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDeviceInfoDto } from '../api/types/createUserDeviceInfoDto';
import e from 'express';

@Injectable()
export class UserDeviceInfoRepository {
  constructor(
    @InjectModel(UserDeviceInfo.name)
    private userDeviceInfoModel: Model<UserDeviceInfoDocument>,
  ) {}

  async addUserDeviceInfo(dto: CreateUserDeviceInfoDto) {
    const { deviceId, deviceName, userId, refreshToken } = dto;
    try {
      const findDevice = await this.userDeviceInfoModel.findOne({
        deviceId,
      });
      if (findDevice) {
        await this.userDeviceInfoModel.updateOne(
          {
            deviceId,
          },
          {
            $set: {
              refreshToken,
              lastActiveDate: new Date().toISOString(),
            },
          },
        );
        return;
      }
      await this.userDeviceInfoModel.create({
        userId: dto.userId,
        deviceId: dto.deviceId,
        refreshToken: dto.refreshToken,
        deviceName: dto.deviceName,
        os_name: dto.osName,
        os_version: dto.osVersion,
        browser_name: dto.browserName,
        browser_version: dto.browserVersion,
        device_type: dto.deviceType,
        device_model: dto.deviceModel,
        device_vendor: dto.deviceVendor,
        user_agent_raw: dto.userAgentRaw,
        created_at: dto.createdAt,
        lastActiveDate: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteDeviceId(deviceId: string) {
    // console.log(deviceId);
    try {
      return await this.userDeviceInfoModel.deleteOne({
        deviceId,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteUserDevices(deviceId: string) {
    try {
      return await this.userDeviceInfoModel.deleteMany({deviceId: {$ne: deviceId}})
    } catch (error){
      console.log(error);
    }
  }
  async findUserDeviceInfoById(deviceId: string) {
    try {
      return await this.userDeviceInfoModel.findOne({ deviceId });
    } catch (error) {
      console.log(error);
    }
  }

  async findAllUserDevicesByUserId(userId: string) {
    try {
      return await this.userDeviceInfoModel.find({userId})
    } catch (error) {
      console.log(error);

    }
  }
}
