import { Test, TestingModule } from '@nestjs/testing';
import { SocketClientService } from './socket-client.service';

describe('SocketService', () => {
  let service: SocketClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketClientService],
    }).compile();

    service = module.get<SocketClientService>(SocketClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to alphapoint websocket server', () => {
    setTimeout(() => {
      expect(service.socketClient.connected).toEqual(true);
    }, 3000);
  });
});
