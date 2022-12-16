import { User } from '../../users/schemas/user.schema';

export type VideoCallHangUpPayload = {
  caller: User;
  receiver: User;
};
