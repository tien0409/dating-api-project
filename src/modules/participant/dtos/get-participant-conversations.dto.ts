import { IsNotEmpty, IsString } from 'class-validator';

export class GetParticipantConversationsDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
