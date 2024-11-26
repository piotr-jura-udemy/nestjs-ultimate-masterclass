import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private readonly labelRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.tasksRepository.findOneBy({ id });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { labels, ...taskData } = createTaskDto;

    // Create task first
    const task = await this.tasksRepository.save(taskData);

    // Add labels if any
    if (labels?.length) {
      await this.updateTaskLabels(task, labels);
    }

    return this.tasksRepository.findOne({
      where: { id: task.id },
      relations: ['labels'],
    });
  }

  private async updateTaskLabels(
    task: Task,
    labelDtos: CreateTaskLabelDto[],
  ): Promise<void> {
    // Remove existing labels
    if (task.labels?.length) {
      await this.labelRepository.remove(task.labels);
    }

    // Create new labels if any
    if (labelDtos?.length) {
      const uniqueLabels = [...new Set(labelDtos.map((l) => l.name))];
      const labels = uniqueLabels.map((name) =>
        this.labelRepository.create({
          name,
          taskId: task.id,
        }),
      );

      await this.labelRepository.save(labels);
    }
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    // Handle basic fields
    const { labels, ...taskData } = updateTaskDto;
    Object.assign(task, taskData);

    // Save task first
    const updatedTask = await this.tasksRepository.save(task);

    // Handle labels if they were included in the update
    if (labels !== undefined) {
      await this.updateTaskLabels(updatedTask, labels);
    }

    // Fetch fresh task with labels
    return this.tasksRepository.findOne({
      where: { id: task.id },
      relations: ['labels'],
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

  public async deleteTask(task: Task): Promise<void> {
    await this.tasksRepository.delete(task);
  }

  async addLabels(task: Task, labelDtos: CreateTaskLabelDto[]): Promise<Task> {
    if (!labelDtos?.length) return task;

    // Get current task with labels
    const currentTask = await this.tasksRepository.findOne({
      where: { id: task.id },
      relations: ['labels'],
    });

    // Filter out duplicates
    const existingNames = currentTask.labels?.map((l) => l.name) || [];
    const newLabels = labelDtos
      .filter((l) => !existingNames.includes(l.name))
      .map((l) =>
        this.labelRepository.create({
          name: l.name,
          taskId: task.id,
        }),
      );

    if (newLabels.length) {
      await this.labelRepository.save(newLabels);
    }

    return this.findOne(task.id);
  }

  async removeLabels(task: Task, labelNames: string[]): Promise<Task> {
    if (!labelNames?.length) return task;

    // Get current task with labels
    const currentTask = await this.tasksRepository.findOne({
      where: { id: task.id },
      relations: ['labels'],
    });

    // Find labels to remove
    const labelsToRemove = currentTask.labels.filter((label) =>
      labelNames.includes(label.name),
    );

    if (labelsToRemove.length) {
      await this.labelRepository.remove(labelsToRemove);
    }

    return this.findOne(task.id);
  }
}
