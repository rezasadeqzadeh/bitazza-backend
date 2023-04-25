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
}
export interface HistoryItem {
  close: number;
  time: number;
}

export interface Instrument {
  InstrumentId: string;
  Symbol: string;
}

@Injectable()
export class TopService implements OnModuleInit {
  constructor(public socketClient: SocketClientService) {}

  async onModuleInit() {}

  async getTopGainers(startDate: Date, endDate: Date) {
    const historyList = await this.socketClient.fetchHistory(
      startDate,
      endDate,
    );
    console.log(historyList);
  }

  getTopLoosers(startDate: Date, endDate: Date) {}
}
