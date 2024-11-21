import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
@Index(['name', 'taskId'], { unique: true }) // Prevent duplicate labels per task
export class TaskLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.labels, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
