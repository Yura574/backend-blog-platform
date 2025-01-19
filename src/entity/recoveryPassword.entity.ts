import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecoveryPasswordDocument = HydratedDocument<RecoveryPassword>

@Schema()
export class RecoveryPassword {
  @Prop({required: true})
  email: string

  @Prop({required: true})
  recoveryCode: string

  @Prop({required: true })
  expirationDate: Date
}

export const RecoveryPasswordSchema = SchemaFactory.createForClass(RecoveryPassword)

