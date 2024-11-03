import { ITask } from './task.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];
}
