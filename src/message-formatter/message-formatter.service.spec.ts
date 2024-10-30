import { Test, TestingModule } from '@nestjs/testing';
import { MessageFormatterService } from './message-formatter.service';

describe('MessageFormatterService', () => {
  let service: MessageFormatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageFormatterService],
    }).compile();

    service = module.get<MessageFormatterService>(MessageFormatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
