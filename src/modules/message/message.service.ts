import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message, MessageDocument } from './message.schema';
import { CreateMessageDTO } from './dtos/create-message.dto';
import { ConversationService } from '../conversation/conversation.service';
import { UpdateMessageDTO } from './dtos/update-message.dto';
import { ParticipantService } from '../participant/participant.service';
import { MessageAttachmentService } from '../message-attachment/message-attachment.service';
import { CreateMessageAttachmentDTO } from '../message-attachment/dtos/create-message-attachment.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly conversationService: ConversationService,
    private readonly participantService: ParticipantService,
    private readonly messageAttachmentService: MessageAttachmentService,
  ) {}

  async getMessagesByConversationIdAndUserId(
    conversationId: string,
    userId: string,
  ) {
    const userParticipant = await this.participantService.getByUserId(userId);

    return this.messageModel
      .find({
        active: true,
        conversation: conversationId,
        createdAt: { $gte: userParticipant.timeJoined },
      })
      .populate({
        path: 'participant',
        populate: 'user',
      })
      .populate('attachments');
  }

  async create(createMessageDTO: CreateMessageDTO) {
    const {
      conversationId,
      content,
      replyTo,
      senderParticipantId,
      attachments,
    } = createMessageDTO;

    // note: update time joined another participant before create message
    await this.participantService.updateManyTimeJoined({ conversationId });

    const message = await this.messageModel.create({
      content,
      replyTo,
      participant: senderParticipantId,
    });

    if (attachments) {
      const attachmentsCreate: CreateMessageAttachmentDTO[] = attachments.map(
        (item) => ({
          link: item,
          messageId: message._id,
        }),
      );

      await this.messageAttachmentService.createMany(attachmentsCreate);
    }
    const newMessage = await this.messageModel
      .findById(message._id)
      .populate({ path: 'participant', populate: 'user' })
      .populate('attachments');

    const conversationUpdateLastMessage = await this.conversationService.updateLastMessage(
      {
        conversationId: conversationId,
        lastMessage: newMessage,
      },
    );

    return { newMessage, conversationUpdated: conversationUpdateLastMessage };
  }

  updateMessage(updateMessageDTO: UpdateMessageDTO) {
    const { messageId, content } = updateMessageDTO;

    return this.messageModel.findOneAndUpdate(
      { _id: messageId },
      {
        $set: {
          content,
        },
      },
      { new: true },
    );
  }

  deleteMessage(messageId: string) {
    return this.messageModel.updateOne(
      {
        _id: messageId,
      },
      {
        $set: {
          active: false,
        },
      },
    );
  }
}
