import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from './task.model';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
