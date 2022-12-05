import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';

import { ChatService } from './chat.service';
import {
  REQUEST_ALL_CONVERSATIONS,
  REQUEST_ALL_MESSAGES,
  REQUEST_DELETE_MESSAGE,
  REQUEST_SEND_MESSAGE,
  SEND_ALL_CONVERSATIONS,
  SEND_ALL_MESSAGES,
  SEND_DELETE_MESSAGE,
  SEND_DELETE_MESSAGE_FAILURE,
  SEND_MESSAGE,
} from './utils/socketType';
import { ConversationDTO } from './dtos/conversation.dto';
import { SendMessageDTO } from './dtos/send-message.dto';
import { IAuthSocket } from './interfaces/auth-socket.interface';
import { ChatSessionManager } from './chat.session';
import { MessageDeleteDTO } from './dtos/message-delete.dto';

@WebSocketGateway(3002, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(ChatSessionManager.name)
    private readonly chatSessionManager: ChatSessionManager,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;
  private readonly logger: Logger = new Logger(ChatGateway.name);

  handleConnection(client: IAuthSocket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.chatSessionManager.setUserSocket(client.user._id, client);
  }

  handleDisconnect(client: IAuthSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.chatSessionManager.removeUserSocket(client.user._id);
  }

  @SubscribeMessage(REQUEST_ALL_CONVERSATIONS)
  async requestAllConversations(@ConnectedSocket() socket: IAuthSocket) {
    const conversations = await this.chatService.getAllConversations(
      socket.user._id,
    );
    const res = conversations.map((conversation) => ({
      ...conversation.toObject(),
      participant: conversation.participants?.[0],
      participants: undefined,
    }));
    socket.emit(SEND_ALL_CONVERSATIONS, res);
  }

  @SubscribeMessage(REQUEST_ALL_MESSAGES)
  async requestAllMessages(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() conversationDTO: ConversationDTO,
  ) {
    const {
      messages,
      receiverParticipant,
      senderParticipant,
    } = await this.chatService.getAllMessages(socket.user._id, conversationDTO);

    socket.emit(SEND_ALL_MESSAGES, {
      messages,
      receiverParticipant,
      senderParticipant,
    });
  }

  @SubscribeMessage(REQUEST_SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() sendMessageDTO: SendMessageDTO,
  ) {
    const { message, receiverParticipant } = await this.chatService.saveMessage(
      socket.user?._id,
      sendMessageDTO,
    );

    const sender = this.chatSessionManager.getUserSocket(socket.user._id);
    const receiverSocket = this.chatSessionManager.getUserSocket(
      receiverParticipant.user,
    );

    sender &&
      sender.emit(SEND_MESSAGE, {
        message,
        conversationIdUpdated: sendMessageDTO.conversationId,
      });
    receiverSocket &&
      receiverSocket.emit(SEND_MESSAGE, {
        message,
        conversationIdUpdated: sendMessageDTO.conversationId,
      });
  }

  @SubscribeMessage(REQUEST_DELETE_MESSAGE)
  async deleteMessage(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() messageDeleteDTO: MessageDeleteDTO,
  ) {
    const sender = this.chatSessionManager.getUserSocket(socket.user._id);
    const receiver = this.chatSessionManager.getUserSocket(
      messageDeleteDTO.receiverId,
    );

    try {
      await this.chatService.deleteMessage(messageDeleteDTO);
      const conversationDTO: ConversationDTO = {
        id: messageDeleteDTO.conversationId,
      };
      const messages = await this.chatService.getAllMessages(
        socket.user._id,
        conversationDTO,
      );
      sender && sender.emit(SEND_DELETE_MESSAGE, { messages });
      receiver && receiver.emit(SEND_DELETE_MESSAGE, { messages });
    } catch (error) {
      sender &&
        sender.emit(SEND_DELETE_MESSAGE_FAILURE, {
          ...messageDeleteDTO,
          errorMessage: error?.message,
        });
    }
  }
}
