import { Test, TestingModule } from '@nestjs/testing';
import { TopService } from './top.service';

describe('TopService', () => {
  let service: TopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopService],
    }).compile();

    service = module.get<TopService>(TopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
