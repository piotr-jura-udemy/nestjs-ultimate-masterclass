import { TaskStatus } from './task.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository, DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindTasksDto } from './dto/find-tasks.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskLabel } from './entities/task-label.entity';
import { CreateTaskLabelDto } from './dto/task-label.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filters: FindTasksDto,
    pagination: PaginationDto,
  ): Promise<[Task[], number]> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.labels', 'labels');

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.createdAfter) {
      query.andWhere('task.createdAt >= :createdAfter', {
        createdAfter: filters.createdAfter,
      });
    }

    if (filters.createdBefore) {
      query.andWhere('task.createdAt <= :createdBefore', {
        createdBefore: filters.createdBefore,
      });
    }

    if (filters.userId) {
      query.andWhere('task.userId = :userId', { userId: filters.userId });
    }

    if (filters.labels) {
      const labelNames = filters.labels.split(',').map((l) => l.trim());
      query.andWhere('labels.name IN (:...labelNames)', { labelNames });
    }

    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    query.orderBy(`task.${sortBy}`, sortOrder);

    query.skip(pagination.offset).take(pagination.limit);

    return query.getManyAndCount();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksRepository.save(createTaskDto);
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(taskId);

    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  async deleteTask(taskId: string): Promise<void> {
    const task = await this.findOne(taskId);
    await this.tasksRepository.remove(task);
  }

  async addLabelsToTask(
    taskId: string,
    labels: CreateTaskLabelDto[],
  ): Promise<Task> {
    return this.dataSource.transaction(async (manager) => {
      const task = await manager.findOne(Task, {
        where: { id: taskId },
        relations: ['labels'],
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      const existingLabels = await manager.find(TaskLabel, {
        where: labels.map((label) => ({ name: label.name })),
      });

      const existingLabelNames = new Set(
        existingLabels.map((label) => label.name),
      );

      const newLabels = labels
        .filter((label) => !existingLabelNames.has(label.name))
        .map((label) =>
          manager.create(TaskLabel, {
            name: label.name,
          }),
        );

      if (newLabels.length > 0) {
        await manager.save(TaskLabel, newLabels);
      }

      task.labels = [...existingLabels, ...newLabels];

      return manager.save(Task, task);
    });
  }

  async moveTaskWithLabels(taskId: string, newUserId: string): Promise<Task> {
    return this.dataSource.transaction(async (manager) => {
      const task = await manager.findOne(Task, {
        where: { id: taskId },
        relations: ['labels'],
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      task.userId = newUserId;
      return manager.save(Task, task);
    });
  }

  async deleteTaskWithLabels(taskId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const task = await manager.findOne(Task, {
        where: { id: taskId },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      await manager.remove(Task, task);
    });
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
}
