import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';

import {
  CALL_HANG_UP,
  CALL_REJECTED,
  CREATE_USER_DISCARD,
  CREATE_USER_LIKE,
  ON_CALL_HANG_UP,
  ON_CALL_REJECTED,
  ON_CREATE_NOTIFICATION,
  ON_CREATE_USER_LIKE,
  ON_TOGGLE_MIC,
  ON_USER_MATCHED,
  ON_USER_UNAVAILABLE,
  ON_VIDEO_CALL_ACCEPTED,
  ON_VIDEO_CALL_INIT,
  ON_VOICE_CALL_ACCEPTED,
  REQUEST_ALL_CONVERSATIONS,
  REQUEST_ALL_MESSAGES,
  REQUEST_DELETE_CONVERSATION,
  REQUEST_DELETE_MESSAGE,
  REQUEST_SEND_MESSAGE,
  REQUEST_STOP_TYPING_MESSAGE,
  REQUEST_TYPING_MESSAGE,
  REQUEST_UPDATE_MESSAGE,
  SEND_ALL_CONVERSATIONS,
  SEND_ALL_MESSAGES,
  SEND_DELETE_CONVERSATION,
  SEND_DELETE_MESSAGE,
  SEND_MESSAGE,
  SEND_STOP_TYPING_MESSAGE,
  SEND_TYPING_MESSAGE,
  SEND_UPDATE_MESSAGE,
  TOGGLE_MIC,
  VIDEO_CALL_ACCEPTED,
  VIDEO_CALL_INIT,
  VOICE_CALL_ACCEPTED,
  VOICE_CALL_INIT,
} from './utils/socketType';
import { GetMessagesDTO } from '../message/dtos/get-messages.dto';
import { IAuthSocket } from './interfaces/auth-socket.interface';
import { GatewaySessionManager } from './gateway.session';
import { MessageDeleteDTO } from '../message/dtos/message-delete.dto';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation/conversation.service';
import { ParticipantService } from '../participant/participant.service';
import { UpdateMessagePayload } from './payloads/update-message.payload';
import { DeleteConversationPayload } from './payloads/delete-conversation.payload';
import { SendMessagePayload } from './payloads/send-message.payload';
import { TypingMessagePayload } from './payloads/typing-message.payload';
import { CallPayload } from './payloads/call.payload';
import { VideoCallAcceptedPayload } from './payloads/video-call-accepted-payload';
import { VideoCallRejectedPayload } from './payloads/video-call-rejected.payload';
import { VideoCallHangUpPayload } from './payloads/video-call-hang-up.payload';
import { ToggleMicPayload } from './payloads/toggle-mic.payload';
import { CreateUserLikePayload } from './payloads/create-user-like.payload';
import { UserMatchService } from '../user-match/user-match.service';
import { UserLikeService } from '../user-like/user-like.service';
import { UserMatchLikeType } from '../user-match/user-match.schema';
import { CreateUserDiscardPayload } from './payloads/create-user-discard.payload';
import { UserDiscardService } from '../user-discard/user-discard.service';
import { NOTIFICATION_EVENT_EMITTER } from './utils/eventEmitterType';
import { CreateNotificationPayload } from './payloads/create-notification.payload';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(GatewaySessionManager.name)
    private readonly gatewaySessionManager: GatewaySessionManager,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly participantService: ParticipantService,
    private readonly userMatchService: UserMatchService,
    private readonly userLikeService: UserLikeService,
    private readonly userDiscardService: UserDiscardService,
  ) {}

  @WebSocketServer()
  server: Server;
  private readonly logger: Logger = new Logger(Gateway.name);

  handleConnection(client: IAuthSocket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.gatewaySessionManager.setUserSocket(client.user._id, client);
  }

  handleDisconnect(client: IAuthSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.gatewaySessionManager.removeUserSocket(client.user._id);
  }

  // chat
  @SubscribeMessage(REQUEST_ALL_CONVERSATIONS)
  async requestAllConversations(@ConnectedSocket() socket: IAuthSocket) {
    // conversation for user (exclude conversation deleted)
    const conversationsResPromise = this.conversationService.getByUserId({
      userId: socket.user._id,
    });
    // conversation for socket on event (include conversation deleted)
    const conversationsSocketPromise = this.conversationService.getByUserIdIncludeConversationDeleted(
      {
        userId: socket.user._id,
      },
    );

    const [conversationsRes, conversationsSocket] = await Promise.all([
      conversationsResPromise,
      conversationsSocketPromise,
    ]);

    conversationsSocket.forEach((conversation) => {
      socket.join(conversation._id.toString());
    });
    socket.emit(SEND_ALL_CONVERSATIONS, { conversations: conversationsRes });
  }

  @SubscribeMessage(REQUEST_DELETE_CONVERSATION)
  async deleteConversation(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() deleteConversationPayload: DeleteConversationPayload,
  ) {
    const { conversationId } = deleteConversationPayload;

    await this.participantService.leftConversation({
      conversationId,
      userId: socket.user._id,
    });
    const conversations = await this.conversationService.getByUserId({
      userId: socket.user._id,
    });

    socket.emit(SEND_DELETE_CONVERSATION, { conversations });
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
    const [conversation, participants] = await Promise.all([
      conversationConversation,
      participantsPromise,
    ]);

    const sender = participants.find(
      (item) => item.user?._id?.toString() === socket.user._id.toString(),
    );
    const recipients = participants.filter(
      (item) => item.user?._id?.toString() !== socket.user._id.toString(),
    );
    const messages = await this.messageService.getMessagesByConversationIdAndUserId(
      sender,
      recipients,
    );

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

  @SubscribeMessage(REQUEST_TYPING_MESSAGE)
  typingMessage(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() typingMessagePayload: TypingMessagePayload,
  ) {
    const { conversationId } = typingMessagePayload;

    socket.to(conversationId).emit(SEND_TYPING_MESSAGE, { conversationId });
  }

  @SubscribeMessage(REQUEST_STOP_TYPING_MESSAGE)
  stopTypingMessage(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() typingMessageDTO: TypingMessagePayload,
  ) {
    const { conversationId } = typingMessageDTO;
    socket
      .to(conversationId)
      .emit(SEND_STOP_TYPING_MESSAGE, { conversationId });
  }

  @SubscribeMessage(REQUEST_SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() sendMessagePayload: SendMessagePayload,
  ) {
    const {
      replyTo,
      content,
      senderParticipantId,
      conversationId,
      attachments,
    } = sendMessagePayload;

    if (!attachments && !content?.trim())
      throw new WsException("Message can't be empty");

    const newMessage = await this.messageService.create({
      content,
      replyTo,
      senderParticipantId,
      attachments,
    });

    // note: update time joined another participant before create message
    await this.participantService.updateManyTimeJoined({
      conversationId,
    });

    const conversationUpdated = await this.conversationService.updateLastMessage(
      {
        conversationId,
        lastMessage: newMessage,
      },
    );

    this.server.in(conversationId).emit(SEND_MESSAGE, {
      message: newMessage,
      conversationUpdated,
    });
  }

  @SubscribeMessage(REQUEST_UPDATE_MESSAGE)
  async updateMessage(
    @MessageBody() updateMessagePayload: UpdateMessagePayload,
  ) {
    const { messageId, conversationId, content } = updateMessagePayload;

    const messageUpdatedPromise = this.messageService.updateMessage({
      messageId,
      content,
    });
    const conversationPromise = this.conversationService.getById(
      conversationId,
    );
    const [messageUpdated, conversation] = await Promise.all([
      messageUpdatedPromise,
      conversationPromise,
    ]);
    const isLastMessageChange =
      conversation.lastMessage._id.toString() === messageId;
    let conversationUpdated;
    if (isLastMessageChange) {
      conversationUpdated = await this.conversationService.updateLastMessage({
        conversationId,
        lastMessage: messageUpdated,
      });
    }

    this.server.in(conversationId).emit(SEND_UPDATE_MESSAGE, {
      message: messageUpdated,
      conversationUpdated,
    });
  }

  @SubscribeMessage(REQUEST_DELETE_MESSAGE)
  async deleteMessage(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() messageDeleteDTO: MessageDeleteDTO,
  ) {
    const { receiverId, messageId, conversation } = messageDeleteDTO;

    const senderSocket = this.gatewaySessionManager.getUserSocket(
      socket.user._id,
    );
    const receiverSocket = this.gatewaySessionManager.getUserSocket(receiverId);

    await this.messageService.deleteMessage(messageId);

    const participants = await this.participantService.getByConversationId(
      conversation._id,
    );
    const sender = participants.find(
      (item) => item.user._id.toString() === socket.user._id.toString(),
    );
    const recipients = participants.filter(
      (item) => item.user._id.toString() !== socket.user._id.toString(),
    );
    const messages = await this.messageService.getMessagesByConversationIdAndUserId(
      sender,
      recipients,
    );

    let conversationUpdated;
    if (
      messages?.length > 0 &&
      conversation.lastMessage._id.toString() === messageId
    ) {
      conversationUpdated = await this.conversationService.updateLastMessage({
        conversationId: conversation._id,
        lastMessage: messages[0],
      });
    }

    senderSocket &&
      senderSocket.emit(SEND_DELETE_MESSAGE, { messages, conversationUpdated });
    receiverSocket &&
      receiverSocket.emit(SEND_DELETE_MESSAGE, {
        messages,
        conversationUpdated,
      });
  }

  handleCallInit(socket: IAuthSocket, payload: CallPayload) {
    const { receiverId, conversationId, callType } = payload;

    const caller = socket.user;
    const receiverSocket = this.gatewaySessionManager.getUserSocket(receiverId);

    if (!receiverSocket) {
      setTimeout(() => {
        socket.emit(ON_USER_UNAVAILABLE);
      }, 2000);
      return;
    }

    receiverSocket.emit(ON_VIDEO_CALL_INIT, {
      conversationId,
      receiverId,
      caller,
      callType,
    });
  }

  @SubscribeMessage(VIDEO_CALL_INIT)
  handleVideoCall(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: CallPayload,
  ) {
    this.handleCallInit(socket, payload);
  }

  @SubscribeMessage(VOICE_CALL_INIT)
  handleVoiceCall(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: CallPayload,
  ) {
    this.handleCallInit(socket, payload);
  }

  async handleCallAccepted(
    socket: IAuthSocket,
    payload: VideoCallAcceptedPayload,
    callEvent: string,
  ) {
    const { caller } = payload;

    const conversation = await this.conversationService.isCreated({
      receiverId: caller._id,
      senderId: socket.user._id,
    });
    if (!conversation) throw new WsException('Conversation not found');

    const callerSocket = this.gatewaySessionManager.getUserSocket(caller._id);
    if (callerSocket) {
      const _payload = { acceptor: socket.user, caller };
      callerSocket.emit(callEvent, _payload);
      socket.emit(callEvent, _payload);
    }
  }

  @SubscribeMessage(VIDEO_CALL_ACCEPTED)
  async handleVideoCallAccepted(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: VideoCallAcceptedPayload,
  ) {
    await this.handleCallAccepted(socket, payload, ON_VIDEO_CALL_ACCEPTED);
  }

  @SubscribeMessage(VOICE_CALL_ACCEPTED)
  async handleVoiceCallAccepted(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: VideoCallAcceptedPayload,
  ) {
    await this.handleCallAccepted(socket, payload, ON_VOICE_CALL_ACCEPTED);
  }

  @SubscribeMessage(TOGGLE_MIC)
  async handleToggleMic(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: ToggleMicPayload,
  ) {
    const { conversationId, userIdDisableMic } = payload;

    this.server.in(conversationId).emit(ON_TOGGLE_MIC, { userIdDisableMic });
  }

  @SubscribeMessage(CALL_REJECTED)
  async handleVideoCallRejected(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: VideoCallRejectedPayload,
  ) {
    const { caller } = payload;

    const callerSocket = this.gatewaySessionManager.getUserSocket(caller._id);

    callerSocket &&
      callerSocket.emit(ON_CALL_REJECTED, { receiver: socket.user });
  }

  @SubscribeMessage(CALL_HANG_UP)
  handleVideoCallHangUp(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: VideoCallHangUpPayload,
  ) {
    const { receiver, caller } = payload;

    if (socket?.user?.id === caller?.id) {
      const receiverSocket = this.gatewaySessionManager.getUserSocket(
        receiver.id,
      );
      socket.emit(ON_CALL_HANG_UP);
      receiverSocket && receiverSocket?.emit(ON_CALL_HANG_UP);
      return;
    }

    socket.emit(ON_CALL_HANG_UP);
    const callerSocket = this.gatewaySessionManager.getUserSocket(caller.id);
    callerSocket && callerSocket.emit(ON_CALL_HANG_UP);
  }

  // user matches
  @SubscribeMessage(CREATE_USER_LIKE)
  async createUserLike(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: CreateUserLikePayload,
  ) {
    const { userLikedId } = payload;

    const user = socket.user;
    const existingLiked = await this.userLikeService.checkExistingLike(
      userLikedId,
      {
        userLikedId: user._id,
      },
    );
    await this.userLikeService.create(user._id, payload);

    const userLikedSocket = this.gatewaySessionManager.getUserSocket(
      userLikedId,
    );
    if (existingLiked) {
      const [newConversation] = await Promise.all([
        this.conversationService.create(user._id, {
          receiverId: userLikedId,
        }),
        this.userMatchService.create(user._id, {
          userMatchedId: user._id,
          type: UserMatchLikeType,
        }),
      ]);

      userLikedSocket &&
        userLikedSocket.emit(ON_USER_MATCHED, {
          userMatched: socket.user,
          conversation: newConversation,
        });
      socket.emit(ON_USER_MATCHED, {
        userMatched: existingLiked.user,
        conversation: newConversation,
      });
    } else {
      userLikedSocket && userLikedSocket.emit(ON_CREATE_USER_LIKE);
    }
  }

  @SubscribeMessage(CREATE_USER_DISCARD)
  async createUserDiscard(
    @ConnectedSocket() socket: IAuthSocket,
    @MessageBody() payload: CreateUserDiscardPayload,
  ) {
    const user = socket.user;
    await this.userDiscardService.create(user._id, payload);
  }

  @OnEvent(NOTIFICATION_EVENT_EMITTER.CREATE)
  createNotification(payload: CreateNotificationPayload) {
    const { recipientIds, notification } = payload;
    console.log('recipientIds', recipientIds);

    recipientIds.forEach((recipientId) => {
      const userSocket = this.gatewaySessionManager.getUserSocket(recipientId);
      if (userSocket) {
        userSocket.emit(ON_CREATE_NOTIFICATION, notification);
      }
    });
  }
}
