import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FindOneParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
