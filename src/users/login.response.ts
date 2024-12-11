import { Expose } from 'class-transformer';

export class LoginResponse {
  constructor(private readonly partial?: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }

  @Expose()
  accessToken: string;
}
