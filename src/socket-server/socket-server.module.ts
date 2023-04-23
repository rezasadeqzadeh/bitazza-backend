import { Module } from '@nestjs/common';
import { SocketServerService } from './socket-server.service';

@Module({
  providers: [SocketServerService]
})
export class SocketServerModule {}
