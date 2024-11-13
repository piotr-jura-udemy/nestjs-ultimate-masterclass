import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig(),
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, DummyService, MessageFormatterService, LoggerService],
})
export class AppModule {}
