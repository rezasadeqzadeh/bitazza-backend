import { TopController } from './top.controller';
import { TopService } from './top.service';
import {
  MOCK_INSTRUMENTS_HISTORY,
  REQUEST_START_DATE,
  REQUEST_END_DATE,
} from './mock.data';
import { TopRequestDTO } from './dto';
import { SocketClientService } from '../socket-client/socket-client.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TopTypesEnum } from './top.types.enum';

describe('TopController', () => {
  let controller: TopController;
  let topService: TopService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TopController],
      providers: [TopService, SocketClientService, ConfigService],
    }).compile();

    topService = moduleRef.get<TopService>(TopService);
    controller = moduleRef.get<TopController>(TopController);
  });

  describe('top', () => {
    it('should return the top instruments', async () => {
      const expected = MOCK_INSTRUMENTS_HISTORY;
      jest.spyOn(topService, 'topInstruments').mockResolvedValueOnce(expected);

      const result = await controller.top({
        type: TopTypesEnum.gainer,
        startDate: REQUEST_START_DATE,
        endDate: REQUEST_END_DATE,
      } as TopRequestDTO);
      expect(result).toEqual(expected);
    });
  });
});
