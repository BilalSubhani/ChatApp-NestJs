import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserStatus extends Document {
  @Prop() userId: string;
  @Prop({ default: false }) online: boolean;
  @Prop() lastSeen: Date;
  @Prop() socketId: string;
}

export const UserStatusSchema = SchemaFactory.createForClass(UserStatus);