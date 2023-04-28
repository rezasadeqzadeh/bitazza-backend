import { Module } from '@nestjs/common';
import { TopController } from './top/top.controller';
import { TopService } from './top/top.service';
import { SocketClientModule } from './socket-client/socket-client.module';
import { SocketClientService } from './socket-client/socket-client.service';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { TopModule } from './top/top.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    SocketClientModule,
    TopModule,
  ],
  controllers: [TopController],
  providers: [TopService, SocketClientService],
})
export class AppModule {}
