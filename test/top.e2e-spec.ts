import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { REQUEST_END_DATE, REQUEST_START_DATE } from '../src/top/mock.data';
import { SocketClientService } from '../src/socket-client/socket-client.service';

describe('Top Controller (e2e)', () => {
  let app: INestApplication;
  let socketClientService: SocketClientService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    socketClientService =
      moduleFixture.get<SocketClientService>(SocketClientService);

    await app.init();
  });

  it('/top API (GET)', async () => {
    await sleep(10000);
    const url = `/top?type=gainers&startDate=${REQUEST_START_DATE}&endDate=${REQUEST_END_DATE}`;
    console.log(url);
    const resp = await request(app.getHttpServer())
      .get(url)
      .send()
      .expect(HttpStatus.OK);
    console.log(resp.body);
    //expect(resp.body);
  }, 15000);
});
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
