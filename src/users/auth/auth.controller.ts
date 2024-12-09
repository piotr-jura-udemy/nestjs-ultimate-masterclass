import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return { accessToken };
  }
}
