import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Instrument, InstrumentHistory, InstrumentsHistory } from '../top/dto';
import { WebSocket } from 'ws';

@Injectable()
export class SocketClientService {
  ws: WebSocket;
  URL: string;
  connected: boolean;
  instruments: Instrument[] = [];

  constructor(private readonly configService: ConfigService) {
    console.log('socket client service constructor');
    this.URL = configService.get('app.websocket_url');

    //console.log('trying to connect to  ' + this.URL);
    this.ws = new WebSocket(this.URL);
    this.ws.onopen = async () => {
      this.connected = true;
      console.log('websocket opened');
      if (this.instruments.length == 0) {
        this.instruments = await this.fetchInstruments();
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      console.log('websocket closed, try to reconnect');
      this.ws = new WebSocket(this.URL);
    };

    this.ws.onerror = () => {
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

  fetchInstruments(): Promise<Instrument[]> {
    console.log('called fetchInstrument');
    const payload = {
      OMSId: 1,
    };
    const requestId = this.sendCmd('GetInstruments', payload);
    return new Promise((resolve) => {
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
        if (ins === null || ins === undefined) {
          throw new Error('websocket response was empty');
        }

        const finalList = ins.filter((item) => {
          // reduce number instruments to speed up response time
          //return item.Symbol.includes('BTCTHB');
          return item.Symbol.includes('THB');
        });
        console.log(finalList);
        resolve(finalList);
      };
    });
  }

  //Fetch all instruments histories from websocket connection by calling getInstrumentHistory()
  async fetchAllHistories(
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
    // console.log(
    //   `fetching history from server, startDate: ${start} endDate: ${end}`,
    // );
    for (const ins of this.instruments) {
      const history = await this.getInstrumentHistory(ins, start, end);
      result.instrumentsHistory.push(history);
    }
    return result;
  }

  //Fetch single instruments history for passed instrument from websocket connection
  async getInstrumentHistory(
    ins: Instrument,
    start: string,
    end: string,
  ): Promise<InstrumentHistory> {
    const payload = {
      InstrumentId: ins.InstrumentId,
      Interval: this.configService.get('app.ticker_history_interval'),
      FromDate: start,
      ToDate: end,
      OMSId: this.configService.get('app.default_oms_id'),
    };
    this.sendCmd('GetTickerHistory', payload);
    return new Promise((resolve) => {
      this.ws.once('message', (buffer: Buffer) => {
        const data = JSON.parse(buffer.toString());
        //console.log(data);
        const o = JSON.parse(data.o);

        const histories = o.map((item) => ({ close: item[4], time: item[0] }));
        //console.log('data: ', histories);
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
