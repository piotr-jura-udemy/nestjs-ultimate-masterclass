import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task.model';

// one-to-many
// User that has many Tasks
// 1) User - user - id
// 2) Task - task - userId
@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;
}
