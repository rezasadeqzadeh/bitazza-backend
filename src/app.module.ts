import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopController } from './top/top.controller';
import { TopService } from './top/top.service';
import { SocketClientModule } from './socket-client/socket-client.module';
import { SocketClientService } from './socket-client/socket-client.service';
import { SocketServerModule } from './socket-server/socket-server.module';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    SocketClientModule,
    SocketServerModule,
  ],
  controllers: [AppController, TopController],
  providers: [AppService, TopService, SocketClientService],
})
export class AppModule {}
