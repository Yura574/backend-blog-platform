import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDeviceInfoDocument = HydratedDocument<UserDeviceInfo>;

@Schema()
export class UserDeviceInfo {
  @Prop()
  userId: string;

  @Prop()
  deviceId: string;

  @Prop()
  refreshToken: string;

  @Prop()
  deviceName: string;

  @Prop()
  os_name: string;

  @Prop()
  os_version: string;

  @Prop()
  browser_name: string;

  @Prop()
  browser_version: string;

  @Prop()
  device_type: string;

  @Prop()
  device_model: string;

  @Prop()
  device_vendor: string;

  @Prop()
  user_agent_raw: string;

  @Prop()
  created_at: Date;

  @Prop({ type: Date, default: ()=> new Date() })
  lastActiveDate: Date;
}

export const UserDeviceInfoSchema = SchemaFactory.createForClass(UserDeviceInfo);
