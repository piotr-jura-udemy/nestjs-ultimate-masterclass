import { User } from './../users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from './task.model';
import { TaskLabel } from './task-label.entity';
import { Expose, Type } from 'class-transformer';

// one-to-many
// User that has many Tasks
// 1) User - user - id
// 2) Task - task - userId
@Entity()
export class Task {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Expose()
  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
  user: User;

  @Expose()
  @Type(() => TaskLabel)
  @OneToMany(() => TaskLabel, (label) => label.task, {
    cascade: true,
  })
  labels: TaskLabel[];

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;
}
