import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from 'src/message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(
    private readonly messageFormatterService: MessageFormatterService,
  ) {}

  log(message: string): string {
    const formattedMessage = this.messageFormatterService.format(message);
    console.log(message);
    return formattedMessage;
  }
}
