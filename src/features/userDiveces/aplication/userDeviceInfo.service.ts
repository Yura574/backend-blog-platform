import { Injectable } from '@nestjs/common';
import { UserDeviceInfoRepository } from '../infrastructure/userDeviceInfo.repository';
import { CreateUserDeviceInfoDto } from '../api/types/createUserDeviceInfoDto';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';
import { UserType } from '../../users/api/models/types/userType';
import { RequestType } from '../../1_commonTypes/commonTypes';

@Injectable()
export class UserDeviceInfoService {
  constructor(private deviceIdRepository: UserDeviceInfoRepository) {}

  async addUserDeviceInfo(
    req: RequestType<any, any, any>,
    dto: UserType,
    refreshToken: string,
  ) {
    const { userId, deviceId } = dto;
    try {
      const ua = req.headers['user-agent'];
      const parser = new UAParser(ua);

      const osName = parser.getOS().name || 'Unknown';
      const osVersion = parser.getOS().version || '';
      const browserName = parser.getBrowser().name || 'Unknown';
      const browserVersion = parser.getBrowser().version || '';
      const deviceType = parser.getDevice().type || 'desktop';
      const deviceModel = parser.getDevice().model || '';
      const deviceVendor = parser.getDevice().vendor || '';
      // const ip_address= ua? ua.ip : ''

      const hashToken = await hash(refreshToken, 8);
      const userDeviceInfo: CreateUserDeviceInfoDto = {
        userId,
        deviceId: deviceId ? deviceId : '',
        id: v4(),
        refreshToken: hashToken,
        deviceName: `${browserName} на ${osName}`,
        osName: osName,
        osVersion: osVersion,
        browserName: browserName,
        browserVersion: browserVersion,
        deviceType: deviceType,
        deviceModel: deviceModel,
        deviceVendor: deviceVendor,
        userAgentRaw: ua ? ua : '',
        createdAt: new Date(),
      };
      return await this.deviceIdRepository.addUserDeviceInfo(userDeviceInfo);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteDeviceId(deviceId: string) {
    try {
      console.log('device id', deviceId);
      return await this.deviceIdRepository.deleteDeviceId(deviceId);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUserDevices(deviceId: string) {
    try {
      return await this.deviceIdRepository.deleteUserDevices(deviceId);
    } catch (error) {
      console.log(error);
    }
  }

  async findUserDeviceInfo(deviceId: string) {
    try {
      return this.deviceIdRepository.findUserDeviceInfoById(deviceId);
    } catch (error) {
      console.log(error);
    }
  }
  async findAllUserDevices(userId: string) {
    try {
      return await this.deviceIdRepository.findAllUserDevicesByUserId(userId);
    } catch (error) {
      console.log(error);
    }
  }
}
