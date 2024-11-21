import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { FindTasksDto } from './dto/find-tasks.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Task } from './entities/task.entity';
import { FindOneParams } from './params/find-one.params';
import { UpdateTaskDto } from './dto/update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskLabelDto } from './dto/task-label.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query() filters: FindTasksDto,
    @Query() pagination: PaginationDto,
  ) {
    const [tasks, total] = await this.tasksService.findAll(filters, pagination);

    return {
      data: tasks,
      meta: {
        total,
        offset: pagination.offset,
        limit: pagination.limit,
      },
    };
  }

  @Get('/:id')
  async findOne(@Param() params: FindOneParams): Promise<Task> {
    return this.tasksService.findOne(params.id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id')
  async updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    try {
      return await this.tasksService.updateTask(params.id, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  @Post(':id/labels')
  async addLabels(
    @Param('id') id: string,
    @Body() labels: CreateTaskLabelDto[],
  ) {
    return this.tasksService.addLabelsToTask(id, labels);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTaskWithLabels(id);
  }
}
