import {
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../task.model';

export class FindTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  createdAfter?: Date;

  @IsOptional()
  @IsDateString()
  createdBefore?: Date;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  labels?: string;
}
