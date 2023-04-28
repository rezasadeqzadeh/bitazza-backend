import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Socket Client')
@Controller({
  path: 'socket-client',
  version: '1',
})
export class SocketClientController {
  constructor(public socketClient: SocketClientService) {}

  @Get('/status')
  @HttpCode(HttpStatus.OK)
  status() {
    return this.socketClient.ws.readyState;
  }
}
