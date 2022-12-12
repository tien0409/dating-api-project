import { Message } from '../../message/message.schema';

export type SendMessagePayload = {
  receiverId: string;
  senderParticipantId: string;
  conversationId: string;
  content: string;
  replyTo?: Message;
  attachments?: string[];
};
