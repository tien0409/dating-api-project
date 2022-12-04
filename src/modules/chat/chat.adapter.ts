import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';
import { parse } from 'cookie';

import { IAuthSocket } from './interfaces/auth-socket.interface';
import { AuthService } from '../auth/auth.service';

export class ChatAdapter extends IoAdapter {
  private authService: AuthService;
  constructor(private readonly app: INestApplicationContext) {
    super(app);
    app
      .resolve<AuthService>(AuthService)
      .then((authService) => (this.authService = authService));
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.use(async (socket: IAuthSocket, next) => {
      const { cookie } = socket.handshake.headers;
      if (!cookie) return next(new Error('Invalid credentials.'));

      try {
        const { Authentication: authenticationToken } = parse(cookie);
        socket.user = await this.authService.getUserFromAuthenticationToken(
          authenticationToken,
        );
        next();
      } catch (error) {
        next(
          new UnauthorizedException(
            "You don't have permission to access this resource",
          ),
        );
      }
    });

    return server;
  }
}
