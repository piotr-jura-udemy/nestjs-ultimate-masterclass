import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const existingUsername = await this.userService.findOneByUsername(
      createUserDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );
    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (
      !user ||
      !(await this.passwordService.verify(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
