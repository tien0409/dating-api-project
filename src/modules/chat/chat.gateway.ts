import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { ChatService } from './chat.service';
import {
  REQUEST_ALL_CONVERSATIONS,
  REQUEST_ALL_MESSAGES,
  REQUEST_SEND_MESSAGE,
  SEND_ALL_CONVERSATIONS,
  SEND_ALL_MESSAGES,
  SEND_MESSAGE,
} from './utils/socketType';
import { ReceiverDTO } from './dtos/receiver.dto';
import { SendMessageDTO } from './dtos/send-message.dto';

@WebSocketGateway(3002, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private readonly logger: Logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    await this.chatService.getUserFromSocket(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(REQUEST_ALL_CONVERSATIONS)
  async requestAllConversations(@ConnectedSocket() socket: Socket) {
    const user = await this.chatService.getUserFromSocket(socket);
    const conversations = await this.chatService.getAllConversations(user._id);
    const res = conversations.map((conversation) => ({
      ...conversation.toObject(),
      receiver: conversation.participants?.[0],
      participants: undefined,
    }));
    socket.emit(SEND_ALL_CONVERSATIONS, res);
  }

  @SubscribeMessage(REQUEST_ALL_MESSAGES)
  async requestAllMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() receiverDto: ReceiverDTO,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessages(
      user?._id,
      receiverDto,
    );

    socket.emit(SEND_ALL_MESSAGES, messages);
  }

  @SubscribeMessage(REQUEST_SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sendMessageDto: SendMessageDTO,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(
      user?._id,
      sendMessageDto,
    );
    this.server.emit(SEND_MESSAGE, message);
  }
}
