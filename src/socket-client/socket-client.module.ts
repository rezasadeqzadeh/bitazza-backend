import { Module } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { SocketClientController } from './socket-client.controller';

@Module({
  providers: [SocketClientService],
  imports: [],
  controllers: [SocketClientController],
})
export class SocketClientModule {}
