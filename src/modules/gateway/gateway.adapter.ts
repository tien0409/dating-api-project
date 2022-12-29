import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';
import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';
import { parse } from 'cookie';

import { IAuthSocket } from './interfaces/auth-socket.interface';
import { AuthService } from '../auth/auth.service';

export class GatewayAdapter extends IoAdapter {
  private authService: AuthService;

  constructor(
    private readonly app: INestApplicationContext,
    private readonly configService: ConfigService,
  ) {
    super(app);
    app
      .resolve<AuthService>(AuthService)
      .then((authService) => (this.authService = authService));
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const serverOptions: ServerOptions = {
      ...options,
      cors: {
        credentials: true,
        origin: [
          this.configService.get('clientURL'),
          this.configService.get('adminURL'),
        ],
      },
    };

    const socketPort = this.configService.get('socketPort');
    console.log('socketPort', socketPort);

    const server = super.createIOServer(socketPort, serverOptions);
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
