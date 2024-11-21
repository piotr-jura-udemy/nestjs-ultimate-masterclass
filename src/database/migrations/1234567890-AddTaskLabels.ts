import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class AddTaskLabels1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create TaskLabel table
    await queryRunner.createTable(
      new Table({
        name: 'task_label',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'taskId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add indexes
    await queryRunner.createIndex(
      'task_label',
      new TableIndex({
        name: 'IDX_TASK_LABEL_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'task_label',
      new TableIndex({
        name: 'IDX_TASK_LABEL_UNIQUE',
        columnNames: ['name', 'taskId'],
        isUnique: true,
      }),
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'task_label',
      new TableForeignKey({
        name: 'FK_TASK_LABEL_TASK',
        columnNames: ['taskId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'task',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task_label');
  }
}
