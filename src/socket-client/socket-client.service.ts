import { Injectable, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketClientService implements OnModuleInit {
  public readonly socketClient: Socket;

  //{
  //   m: 0,
  //   i: 0,
  //   n: 'AuthenticateUser',
  //   o: JSON.stringify({ username, password }),
  // }
  // wss://apibitazzastage.cdnhop.net/WSGateway

  constructor() {
    this.socketClient = io('wss://apexapi.bitazza.com/WSGateway/', {
      transports: ['websocket'],
    });
  }
  onModuleInit() {
    this.socketClient.on('connect', () => {
      console.log('websocket connected');
    });

    this.socketClient.emit('newMessage', { msg: 'besmellah' });

    this.socketClient.on('onMessage', (payload) => {
      console.log('message received from server ');
      console.log(payload);
    });
    this.socketClient.on('connect_error', (err) => {
      console.log(`websocket connecting error ${err.stack}`);
    });
  }
}
