import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocket } from 'ws';

@Injectable()
export class SocketClientService implements OnModuleInit {
  ws: WebSocket;
  URL: string;
  constructor(private readonly configService: ConfigService) {
    this.URL = configService.get('app.websocket_url');
    this.ws = new WebSocket(this.URL);
  }

  onModuleInit() {
    this.ws.onopen = (event) => {
      console.log('websocket opened');
    };

    this.ws.onclose = (event) => {
      console.log('websocket closed, try to reconnect');
      this.ws = new WebSocket(this.URL);
    };

    this.ws.onerror = (event) => {
      console.log('websocket err:', event);
      this.ws = new WebSocket(this.URL);
    };

    this.ws.onmessage = (event) => {
      console.log('websocket on message received:', event?.data);
      const data = JSON.parse(event.data);
      const n = data?.n;

      switch (n) {
        case 'AuthenticateUser':
          console.log('AuthenticateUser resp');
          //dispatch(handleLogin(data.o));
          break;
        case 'LogoutEvent':
        case 'Logout':
          //dispatch(handleLogout(data.o));
          break;
        default:
          console.log('[this.ws.onmessage] unknown response:', data);
      }
    };
  }
  getInstruments = () => {
    const payload = {
      OMSId: 1,
    };
    const frame = {
      m: 0,
      i: 0,
      n: 'GetInstruments',
      o: JSON.stringify(payload),
    };

    this.ws.send(frame);
  };

  getHistory(startDate: Date, endDate: Date) {
    
  }

}
