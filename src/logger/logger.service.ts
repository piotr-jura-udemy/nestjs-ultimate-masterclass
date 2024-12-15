import { MessageFormatterService } from './../message-formatter/message-formatter.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  constructor(
    private readonly messageFormatterService: MessageFormatterService,
  ) {}

  log(message: string): string {
    const formattedMessage = this.messageFormatterService.format(message);
    return formattedMessage;
  }
}
