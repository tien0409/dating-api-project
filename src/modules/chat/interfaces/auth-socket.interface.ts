import { Socket } from 'socket.io';

import { User } from '../../users/schemas/user.schema';

export interface IAuthSocket extends Socket {
  user?: User;
}
