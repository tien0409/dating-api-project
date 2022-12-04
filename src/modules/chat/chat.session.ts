import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { IChatSession } from './interfaces/chat-session.interface';
import { IAuthSocket } from './interfaces/auth-socket.interface';

@Injectable()
export class ChatSessionManager implements IChatSession {
  private readonly sessions = new Map<string, IAuthSocket>();

  getUserSocket(userId: string | Types.ObjectId) {
    return this.sessions.get(userId.toString());
  }

  setUserSocket(userId: string | Types.ObjectId, socket: IAuthSocket) {
    this.sessions.set(userId.toString(), socket);
  }

  removeUserSocket(userId: string | Types.ObjectId) {
    this.sessions.delete(userId.toString());
  }

  getSockets() {
    return this.sessions;
  }
}
