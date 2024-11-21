import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async validate(value: any, args: ValidationArguments) {
    const [tableName, column] = args.constraints;
    const count = await this.entityManager
      .getRepository(tableName)
      .count({ where: { [column]: value } });
    return count === 0;
  }

  defaultMessage(args: ValidationArguments) {
    const [tableName, column] = args.constraints;
    return `${column} already exists in ${tableName}`;
  }
}

export function IsUnique(tableName: string, column: string) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} already exists`,
      },
      constraints: [tableName, column],
      validator: IsUniqueConstraint,
    });
  };
}
