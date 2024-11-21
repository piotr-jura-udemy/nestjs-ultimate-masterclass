import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { TaskStatus } from '../task.model';
import { TaskLabel } from './task-label.entity';

@Entity()
@Index(['status', 'userId'])
@Index(['createdAt'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @OneToMany(() => TaskLabel, (label) => label.task, {
    cascade: true,
  })
  labels: TaskLabel[];
}
