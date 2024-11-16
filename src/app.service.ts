import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { AppConfig } from './config/app.config';
import { TypedConfigService } from './config/typed-config.service';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService,
    private readonly loggerSerivce: LoggerService,
    private readonly configService: TypedConfigService,
  ) {}

  getHello(): string {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    return this.loggerSerivce.log(
      `${prefix} Hello World! ${this.dummyService.work()}`,
    );
  }
}
