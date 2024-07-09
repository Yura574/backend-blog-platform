import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string

  @Prop({ required: true })
  expirationDate: string

  @Prop({ required: true })
  isConfirm: boolean
}


@Schema({ timestamps: true })
export class User {


  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;


  @Prop()
  createdAt: string;

  @Prop({type: EmailConfirmation})
  emailConfirmation: EmailConfirmation
}


export const UserSchema = SchemaFactory.createForClass(User);
