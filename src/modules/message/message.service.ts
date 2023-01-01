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
import { Participant } from '../participant/participant.schema';

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
    senderParticipant: Participant,
    recipientsParticipant: Participant[],
  ) {
    console.log('recipientsParticipants', recipientsParticipant);
    return this.messageModel
      .find({
        active: true,
        participant: {
          $in: [
            senderParticipant._id,
            ...recipientsParticipant.map((item) => item._id),
          ],
        },
        createdAt: { $gte: senderParticipant.timeJoined },
      })
      .populate({
        path: 'participant',
        populate: 'user',
      })
      .populate('attachments');
  }

  async create(createMessageDTO: CreateMessageDTO) {
    const {
      content,
      replyTo,
      senderParticipantId,
      attachments,
    } = createMessageDTO;

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
    return this.messageModel
      .findById(message._id)
      .populate({ path: 'participant', populate: 'user' })
      .populate('attachments');
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
