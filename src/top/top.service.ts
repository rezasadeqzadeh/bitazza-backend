import { Injectable } from '@nestjs/common';
import { SocketClientService } from 'src/socket-client/socket-client.service';

@Injectable()
export class TopService {
  constructor(public socketClient: SocketClientService) {}

  getTopGainers(startDate: Date, endDate: Date) {}

  getTopLoosers(startDate: Date, endDate: Date) {}
}
