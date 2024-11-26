import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskLabelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
