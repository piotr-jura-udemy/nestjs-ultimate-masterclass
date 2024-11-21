import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
