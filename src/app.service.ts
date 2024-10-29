import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';

@Injectable()
export class AppService {
  constructor(private readonly dummyService: DummyService) {}

  getHello(): string {
    return `Hello World! ${this.dummyService.work()}`;
  }
}
