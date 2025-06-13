import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop() from: string;
  @Prop() to: string;
  @Prop() text: string;
  @Prop({ default: false }) delivered: boolean;
  @Prop({ default: false }) read: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);