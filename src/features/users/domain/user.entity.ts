import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;


@Schema()
export class EmailConfirmation {
  @Prop()
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  isConfirm: boolean;
}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class User {
  @Prop({ required: true, unique: true,  })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  createdAt: string;

  @Prop({ type: EmailConfirmationSchema, _id: false})
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);