import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SocketClientService } from 'src/socket-client/socket-client.service';

@Controller('top')
export class TopController {
  constructor(public socketClient: SocketClientService) {
    this.socketClient.socketClient.connected;
  }

  @Get('/gainers')
  topGainers() {
    return [{ name: 'BTCHTB', time: 165487554545 }];
  }
}
