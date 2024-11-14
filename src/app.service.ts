import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService,
    private readonly loggerSerivce: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  getHello(): string {
    const prefix = this.configService.get<string>('app.messagePrefix');
    return this.loggerSerivce.log(
      `${prefix} Hello World! ${this.dummyService.work()}`,
    );
  }
}
