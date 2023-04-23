import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketServerService implements OnModuleInit {
  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      socket.emit('hello');
      socket.on('howdy', (message) => {
        console.log(message);
      });
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log('server side received newMessage with below body:');
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }
}
