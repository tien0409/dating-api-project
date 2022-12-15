import { User } from '../../users/schemas/user.schema';

export type VideoCallAcceptedPayload = {
  caller: User;
};
