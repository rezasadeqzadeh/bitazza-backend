import { Injectable, OnModuleInit } from '@nestjs/common';
import { TICKER_HISTORY_INTERVAL, DEFAULT_OMSId } from '../const';
import { ConfigService } from '@nestjs/config';
import {
  HistoryItem,
  Instrument,
  InstrumentHistory,
  InstrumentsHistory,
} from 'src/top/top.service';
import { WebSocket } from 'ws';

@Injectable()
export class SocketClientService implements OnModuleInit {
  ws: WebSocket;
  URL: string;
  connected: boolean;
  instruments: Instrument[] = [];

  constructor(private readonly configService: ConfigService) {
    this.URL = configService.get('app.websocket_url');
  }

  onModuleInit() {
    console.log('trying to connect to  ' + this.URL);
    this.ws = new WebSocket(this.URL);
    this.ws.onopen = (event) => {
      this.connected = true;
      console.log('websocket opened');
      if (this.instruments.length == 0) {
        this.fetchInstruments((instruments: Instrument[]) => {
          this.instruments = instruments;
        });
      }
    };

    this.ws.onclose = (event) => {
      this.connected = false;
      console.log('websocket closed, try to reconnect');
      this.ws = new WebSocket(this.URL);
    };

    this.ws.onerror = (event) => {
      this.connected = false;
      console.log('websocket err:', event);
      this.ws = new WebSocket(this.URL);
    };
  }

  sendCmd(cmd: string, payload: any): number {
    const requestId = this.uid();
    const frame = {
      m: 0,
      i: requestId,
      n: cmd,
      o: JSON.stringify(payload),
    };
    this.ws.send(JSON.stringify(frame));
    console.log(
      `cmd ${cmd} sent to websocket. payload:${JSON.stringify(payload)}`,
    );
    return requestId;
  }

  fetchInstruments(callback: (instruments: Instrument[]) => void) {
    const payload = {
      OMSId: 1,
    };
    const requestId = this.sendCmd('GetInstruments', payload);
    this.ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      // this response is not belong to us
      if (data.i != requestId) {
        return;
      }

      const o: Instrument[] = JSON.parse(data.o);
      const ins = o.map((item) => {
        return {
          InstrumentId: item.InstrumentId,
          Symbol: item.Symbol,
        } as Instrument;
      });
      const finalList = ins.filter((item) => {
        return item.Symbol.endsWith('THB');
      });
      callback(finalList);
      console.log(this.instruments);
    };
  }

  async fetchHistory(
    startDate: Date,
    endDate: Date,
  ): Promise<InstrumentsHistory> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    const result = {
      startDate: startDate,
      endDate: endDate,
    } as InstrumentsHistory;
    console.log(
      `fetching history from server, startDate: ${start} endDate: ${end}`,
    );

    const requests = this.instruments.map((item) => {
      const payload = {
        InstrumentId: item.InstrumentId,
        Interval: TICKER_HISTORY_INTERVAL,
        FromDate: start,
        ToDate: end,
        OMSId: DEFAULT_OMSId,
      };
      this.sendCmd('GetTickerHistory', payload);
      return new Promise((resolve, reject) => {
        this.ws.on('once', (event) => {
          const data = JSON.parse(event);
          const n = data?.n;
          const o: HistoryItem[] = JSON.parse(data.o);
          console.log('data: ', data.o);
          const instrumentHistory = {
            instrument: item,
            history: o,
          } as InstrumentHistory;
          return resolve(instrumentHistory);
        });
      });
    });
    const allPromise = Promise.all(requests);
    const allInstrumentsHistory = await allPromise;
    result.instrumentsHistory = allInstrumentsHistory as InstrumentHistory[];
    return result;
  }

  uid = function () {
    return new Date().getTime(); // TODO need to consider if request Id is not unique per  mili, add some extra random values
  };
}
