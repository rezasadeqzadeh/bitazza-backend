import { Test, TestingModule } from '@nestjs/testing';
import { SocketClientService } from './socket-client.service';
import { ConfigService } from '@nestjs/config';

describe('SocketService', () => {
  let service: SocketClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketClientService, ConfigService],
    }).compile();

    service = module.get<SocketClientService>(SocketClientService);
  });

  it('should connect to alphapoint websocket server', () => {
    setTimeout(() => {
      expect(service.ws.readyState).toEqual(1);
    }, 5000);
  });
});
