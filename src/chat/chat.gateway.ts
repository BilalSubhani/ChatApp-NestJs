import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      await this.chatService.setUserOnline(userId, client.id);
      const undelivered = await this.chatService.getUndeliveredMessages(userId);
      undelivered.forEach((msg) => {
        client.emit('new-message', msg);
        this.chatService.markDelivered(msg._id.toString());
      });
      this.server.emit('status-change', { userId, online: true });
    }
  }

  async handleDisconnect(client: Socket) {
    const result = await this.chatService.setUserOffline(client.id);
    if (result) {
      this.server.emit('status-change', {
        userId: result.userId,
        online: false,
        lastSeen: result.lastSeen,
      });
    }
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(@MessageBody() data: any) {
    const { from, to, text } = data;
    const msg = await this.chatService.saveMessage({ from, to, text });

    const receiverSocketId = await this.chatService.getUserSocket(to);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('new-message', msg);
      await this.chatService.markDelivered(msg._id.toString());
    }
  }

  @SubscribeMessage('mark-read')
  async markRead(@MessageBody() { messageId }: any) {
    await this.chatService.markRead(messageId);
  }

  @SubscribeMessage('get-status')
  async getStatus(@MessageBody() { userId }: any) {
    const status = await this.chatService.getUserStatus(userId);
    return status;
  }
}