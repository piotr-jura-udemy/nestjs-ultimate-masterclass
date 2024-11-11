import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ITask, TaskStatus } from './task.model';

@Entity()
export class Task implements ITask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}
