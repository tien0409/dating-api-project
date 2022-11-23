import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  REQUEST_ALL_CONVERSATIONS,
  REQUEST_ALL_MESSASGES,
  SEND_ALL_CONVERSATIONS,
  SEND_ALL_MESSAGES,
} from './utils/socketType';

@WebSocketGateway()
export class ChatGateway {
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
    const conversations = await this.chatService.getAllConversations();
    socket.emit(SEND_ALL_CONVERSATIONS);
  }

  @SubscribeMessage(REQUEST_ALL_MESSASGES)
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    const messages = await this.chatService.getAllMessages();
    socket.emit(SEND_ALL_MESSAGES, messages);
  }
}
