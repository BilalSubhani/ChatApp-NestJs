import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { UserStatus } from './schemas/user-status.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(UserStatus.name) private userStatusModel: Model<UserStatus>,
  ) {}

  async saveMessage(data: any) {
    return this.messageModel.create(data);
  }

  async markDelivered(msgId: string) {
    return this.messageModel.findByIdAndUpdate(msgId, { delivered: true });
  }

  async markRead(msgId: string) {
    return this.messageModel.findByIdAndUpdate(msgId, { read: true });
  }

  async getUndeliveredMessages(userId: string) {
    return this.messageModel.find({ to: userId, delivered: false });
  }

  async setUserOnline(userId: string, socketId: string) {
    return this.userStatusModel.findOneAndUpdate(
      { userId },
      { online: true, socketId, lastSeen: new Date() },
      { upsert: true, new: true },
    );
  }

  async setUserOffline(socketId: string) {
    return this.userStatusModel.findOneAndUpdate(
      { socketId },
      { online: false, lastSeen: new Date() },
    );
  }

  async getUserSocket(userId: string) {
    const user = await this.userStatusModel.findOne({ userId, online: true });
    return user?.socketId;
  }

  async getUserStatus(userId: string) {
    return this.userStatusModel.findOne({ userId });
  }
}