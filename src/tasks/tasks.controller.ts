import { Controller, Get, Param } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  public findAll(): string[] {
    return ['A', 'B'];
  }

  @Get('/:id')
  public findOne(@Param('id') id: string): string {
    return `The number is ${id}`;
  }
}
