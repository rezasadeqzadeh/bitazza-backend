import { Injectable, OnModuleInit } from '@nestjs/common';
import { TICKER_HISTORY_INTERVAL, DEFAULT_OMSId } from '../const';
import { ConfigService } from '@nestjs/config';
import {
  HistoryItem,
  Instrument,
  InstrumentHistory,
  InstrumentsHistory,
} from 'src/top/dto';
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

      // to increase performance in test environment, enable below filter
      const finalList = ins.filter((item) => {
        return item.Symbol.includes('BTCTHB');
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
      instrumentsHistory: [],
    } as InstrumentsHistory;
    console.log(
      `fetching history from server, startDate: ${start} endDate: ${end}`,
    );

    for (const ins of this.instruments) {
      const history = await this.getInstrumentHistory(ins, start, end);
      result.instrumentsHistory.push(history);
    }
    console.log({ result });
    return result;
  }

  async getInstrumentHistory(
    ins: Instrument,
    start: string,
    end: string,
  ): Promise<InstrumentHistory> {
    const payload = {
      InstrumentId: ins.InstrumentId,
      Interval: TICKER_HISTORY_INTERVAL,
      FromDate: start,
      ToDate: end,
      OMSId: DEFAULT_OMSId,
    };
    this.sendCmd('GetTickerHistory', payload);
    return new Promise((resolve, reject) => {
      this.ws.once('message', (buffer: Buffer) => {
        const data = JSON.parse(buffer.toString());
        const o = JSON.parse(data.o);
        //console.log(o);
        const histories = [] as HistoryItem[];
        o.map((item) => {
          histories.push({ close: item[4], time: item[0] });
        });
        console.log('data: ', histories);
        const instrumentHistory = {
          instrument: ins,
          history: histories,
        } as InstrumentHistory;
        return resolve(instrumentHistory);
      });
    });
  }

  uid = function () {
    return new Date().getTime(); // TODO need to consider if request Id is not unique per  mili, add some extra random values
  };
}
