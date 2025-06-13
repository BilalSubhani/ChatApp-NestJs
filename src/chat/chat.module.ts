import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './schemas/message.schema';
import { UserStatus, UserStatusSchema } from './schemas/user-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: UserStatus.name, schema: UserStatusSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}