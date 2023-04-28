import { Injectable, OnModuleInit } from '@nestjs/common';
import { SocketClientService } from 'src/socket-client/socket-client.service';
import { InstrumentHistory } from './dto';
import { TopFeatures } from './top.interface';
import { TopTypesEnum } from './top.types.enum';

@Injectable()
export class TopService implements OnModuleInit, TopFeatures {
  constructor(public socketClient: SocketClientService) {}

  async onModuleInit() {}

  async topInstruments(topType: TopTypesEnum, startDate: Date, endDate: Date) {
    const instruments = await this.socketClient.fetchHistory(
      startDate,
      endDate,
    );
    this.diffPrice(instruments.instrumentsHistory);

    // debug purpose
    for (const iterator of instruments.instrumentsHistory) {
      console.log(iterator.instrument.Symbol);
      console.log(iterator.diffPrice);
    }
    return this.topSlice(topType, instruments.instrumentsHistory);
  }

  diffPrice(insHistory: InstrumentHistory[]) {
    for (let i = 0; i < insHistory.length; i++) {
      const item = insHistory[i];
      if (item.history.length === 0 || item.history.length === 1) {
        continue;
      }
      const startPrice = item.history[0].close;
      const lastPrice = item.history[item.history.length - 1].close;
      item.diffPrice = lastPrice - startPrice;
      insHistory[i] = item;
    }
    return insHistory;
  }

  topSlice(type: TopTypesEnum, list: InstrumentHistory[]) {
    list.sort((a: InstrumentHistory, b: InstrumentHistory) => {
      return type === 'gainers'
        ? b.diffPrice - a.diffPrice
        : a.diffPrice - b.diffPrice;
    });
    return list.slice(0, 5);
  }
}
