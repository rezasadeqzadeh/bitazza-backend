import { Test, TestingModule } from '@nestjs/testing';
import { TopService } from './top.service';
import { SocketClientService } from 'src/socket-client/socket-client.service';
import { ConfigService } from '@nestjs/config';
import {
  QBTCInst,
  MOCK_INSTRUMENTS_HISTORY,
  REQUEST_END_DATE,
  REQUEST_START_DATE,
} from './mock.data';
import { TopTypesEnum } from './top.types.enum';

describe('TopService', () => {
  let socketClientService: SocketClientService;
  let topService: TopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopService, SocketClientService, ConfigService],
    }).compile();

    socketClientService = module.get<SocketClientService>(SocketClientService);
    topService = module.get<TopService>(TopService);
  });

  it('should return the BTCTHB as first instrument', async () => {
    const startDate = new Date(REQUEST_START_DATE);
    const endDate = new Date(REQUEST_END_DATE);
    jest.spyOn(socketClientService, 'fetchAllHistories').mockResolvedValue({
      startDate: startDate,
      endDate: endDate,
      instrumentsHistory: MOCK_INSTRUMENTS_HISTORY,
    });

    const result = await topService.topInstruments(
      TopTypesEnum.gainer,
      startDate,
      endDate,
    );
    expect(result.length).toEqual(2);
    //first item should be
    expect(result[0].instrument.Symbol).toEqual(QBTCInst.Symbol);
  });
});
