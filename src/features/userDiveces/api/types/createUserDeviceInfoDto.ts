import { Prop } from '@nestjs/mongoose';

export type CreateUserDeviceInfoDto = {
  userId: string;
  deviceId: string;
  refreshToken: string;
  deviceName: string;
  osName: string;
  osVersion: string;
  browserName: string;
  browserVersion: string;
  deviceType: string;
  deviceModel: string;
  deviceVendor: string;
  userAgentRaw: string;
  id: string;
  createdAt: Date;
};
