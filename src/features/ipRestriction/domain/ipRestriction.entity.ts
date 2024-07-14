import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type IpRestrictionDocument = HydratedDocument<IpRestriction>

@Schema()
export class IpRestriction {
  @Prop()
  ip: string

  @Prop()
  url: string

  @Prop()
  data: string
}


export const IpRestrictionSchema = SchemaFactory.createForClass(IpRestriction)