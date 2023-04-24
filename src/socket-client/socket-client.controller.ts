import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';

@Controller('socket-client')
export class SocketClientController {
  constructor(public socketClient: SocketClientService) {}

  @Get('/status')
  @HttpCode(HttpStatus.OK)
  status() {
    return this.socketClient.ws.readyState;
  }
}
