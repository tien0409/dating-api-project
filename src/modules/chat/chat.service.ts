import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { MessageRepository } from './repositories/message.repository';
import { ConversationRepository } from './repositories/conversation.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) throw new WsException('Invalid credentials.');

    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(
      authenticationToken,
    );

    if (!user) throw new WsException('Invalid credentials.');
    return user;
  }

  getAllConversations() {
    return this.conversationRepository.find({
      relations: ['user'],
    });
  }

  getAllMessages() {
    return this.messageRepository.find({
      relations: ['user'],
    });
  }
}
