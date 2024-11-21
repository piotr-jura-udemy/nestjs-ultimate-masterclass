import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../user/user.entity';
import { TaskLabel } from '../tasks/entities/task-label.entity';
import { AddTaskLabels1234567890 } from './migrations/1234567890-AddTaskLabels';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Task, User, TaskLabel],
  migrations: [AddTaskLabels1234567890],
  synchronize: false, // Set to false in production
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
