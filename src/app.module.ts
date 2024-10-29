import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DummyService],
})
export class AppModule {}
