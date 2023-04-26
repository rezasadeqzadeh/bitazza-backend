import { Injectable, OnModuleInit } from '@nestjs/common';
import { SocketClientService } from 'src/socket-client/socket-client.service';

export interface DiffPrice {
  diffPrice: number;
  startPrice: number;
  endPrice: number;
}
export interface InstrumentsHistory {
  startDate: Date;
  endDate: Date;
  instrumentsHistory: InstrumentHistory[];
}

export interface InstrumentHistory {
  instrument: Instrument;
  history: HistoryItem[];
  diffPrice: number;
}
export interface HistoryItem {
  close: number;
  time: number;
}

export type TopType = 'gainers' | 'loosers';
export interface Instrument {
  InstrumentId: string;
  Symbol: string;
}

@Injectable()
export class TopService implements OnModuleInit {
  constructor(public socketClient: SocketClientService) {}

  async onModuleInit() {}

  async getTopGainers(topType: TopType, startDate: Date, endDate: Date) {
    const instrumentsHistory = await this.socketClient.fetchHistory(
      startDate,
      endDate,
    );
    this.diffPrice(instrumentsHistory.instrumentsHistory);
    for (const iterator of instrumentsHistory.instrumentsHistory) {
      console.log(iterator.instrument.Symbol);
      console.log(iterator.diffPrice);
    }
    return this.top(topType, instrumentsHistory.instrumentsHistory);
  }

  diffPrice(insHistory: InstrumentHistory[]): InstrumentHistory[] {
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

  top(type: TopType, list: InstrumentHistory[]) {
    list.sort((a: InstrumentHistory, b: InstrumentHistory) => {
      if (type === 'gainers') {
        return b.diffPrice - a.diffPrice;
      } else {
        return a.diffPrice - b.diffPrice;
      }
    });
    return list.slice(0, 5);
  }
}
