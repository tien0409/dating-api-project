import { User } from '../../users/schemas/user.schema';

export type VideoCallRejectedPayload = {
  caller: User;
};
