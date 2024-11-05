import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TaskStatus } from './task.model';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
