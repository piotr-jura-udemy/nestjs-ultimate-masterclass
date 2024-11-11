// import { randomUUID } from 'node:crypto';
import { CreateTaskDto } from './create-task.dto';
import { ITask, TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  public findAll(): Promise<ITask[]> {
    return this.tasksRepository.find();
  }

  public findOne(id: string): Promise<ITask | null> {
    return this.tasksRepository.findOneBy({ id });
  }

  public create(createTaskDto: CreateTaskDto): Promise<ITask> {
    const task: ITask = {
      ...createTaskDto,
    };
    return this.tasksRepository.save(task);
  }

  public updateTask(task: ITask, updateTaskDto: UpdateTaskDto): Promise<ITask> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  public async deleteTask(task: ITask): Promise<void> {
    if (task.id) {
      await this.tasksRepository.delete(task.id);
    }
  }
}
