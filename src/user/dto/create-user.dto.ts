import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
// import { IsUnique } from 'src/validators/is-unique.validator';

export class CreateUserDto {
  @IsEmail()
  // @IsUnique('User', 'email')
  email: string;

  @IsNotEmpty()
  // @IsUnique('User', 'username')
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
