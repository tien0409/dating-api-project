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

import {
  REQUEST_ALL_CONVERSATIONS,
  REQUEST_ALL_MESSAGES,
  REQUEST_DELETE_MESSAGE,
  REQUEST_SEND_MESSAGE,
  SEND_ALL_CONVERSATIONS,
  SEND_ALL_MESSAGES,
  SEND_DELETE_MESSAGE,
  SEND_MESSAGE,
} from './utils/socketType';
import { GetMessagesDTO } from '../message/dtos/get-messages.dto';
import { SendMessageDTO } from './dtos/send-message.dto';
import { IAuthSocket } from './interfaces/auth-socket.interface';
import { ChatSessionManager } from './chat.session';
import { MessageDeleteDTO } from '../message/dtos/message-delete.dto';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation/conversation.service';
import { CreateMessageDTO } from '../message/dtos/create-message.dto';
import { ParticipantService } from '../participant/participant.service';

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
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly participantService: ParticipantService,
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
    const conversations = await this.conversationService.getConversations(
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
    @MessageBody() getMessageDTO: GetMessagesDTO,
  ) {
    const { conversationId } = getMessageDTO;

    const conversationConversation = this.conversationService.getById(
      conversationId,
    );
    const participantsPromise = this.participantService.getByConversationId(
      conversationId,
    );
    const messagesPromise = this.messageService.getMessagesByConversationId(
      conversationId,
    );

    const [conversation, participants, messages] = await Promise.all([
      conversationConversation,
      participantsPromise,
      messagesPromise,
    ]);

    socket.emit(SEND_ALL_MESSAGES, {
      conversation,
      messages,
      receiverParticipant: participants.find(
        (participant) =>
          participant.user._id.toString() !== socket.user._id.toString(),
      ),
      senderParticipant: participants.find(
        (participant) =>
          participant.user._id.toString() === socket.user._id.toString(),
      ),
    });
  }

  @SubscribeMessage(REQUEST_SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() sendMessageDTO: SendMessageDTO,
  ) {
    const {
      replyTo,
      content,
      receiverId,
      senderParticipantId,
      conversationId,
    } = sendMessageDTO;

    const payloadCreateMessage: CreateMessageDTO = {
      conversationId,
      content,
      replyTo,
      participant: senderParticipantId,
    };
    const newMessage = await this.messageService.createMessage(
      payloadCreateMessage,
    );

    const sender = this.chatSessionManager.getUserSocket(socket.user._id);
    const receiverSocket = this.chatSessionManager.getUserSocket(receiverId);

    sender &&
      sender.emit(SEND_MESSAGE, {
        message: newMessage,
        conversationIdUpdated: sendMessageDTO.conversationId,
      });
    receiverSocket &&
      receiverSocket.emit(SEND_MESSAGE, {
        message: newMessage,
        conversationIdUpdated: sendMessageDTO.conversationId,
      });
  }

  @SubscribeMessage(REQUEST_DELETE_MESSAGE)
  async deleteMessage(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() messageDeleteDTO: MessageDeleteDTO,
  ) {
    const { receiverId, messageId, conversation } = messageDeleteDTO;

    const sender = this.chatSessionManager.getUserSocket(socket.user._id);
    const receiver = this.chatSessionManager.getUserSocket(receiverId);

    await this.messageService.deleteMessage(messageId);
    const messages = await this.messageService
      .getMessagesByConversationId(conversation._id)
      .sort({ createdAt: 1 });

    let lastMessageConversation;
    if (
      messages?.length > 0 &&
      conversation.lastMessage._id.toString() === messageId
    ) {
      await this.conversationService.updateLastMessage({
        conversationId: conversation._id,
        lastMessage: messages[messages.length - 1],
      });
      lastMessageConversation = messages[messages.length - 1];
    }

    sender &&
      sender.emit(SEND_DELETE_MESSAGE, { messages, lastMessageConversation });
    receiver &&
      receiver.emit(SEND_DELETE_MESSAGE, { messages, lastMessageConversation });
  }
}
