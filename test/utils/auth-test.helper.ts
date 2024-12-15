import { User } from '../../src/users/user.entity';
import { Role } from '../../src/users/role.enum';
import { PasswordService } from '../../src/users/password/password.service';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestSetup } from './test-setup';

export class AuthTestHelper {
  constructor(private testSetup: TestSetup) {}

  async createUser(userData: Partial<User> = {}) {
    const defaultUser = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
      roles: [] as Role[],
    };

    const userRepo = this.testSetup.app.get(getRepositoryToken(User));
    const passwordService = this.testSetup.app.get(PasswordService);

    const hashedPassword = await passwordService.hash(
      userData.password || defaultUser.password,
    );

    return await userRepo.save({
      ...defaultUser,
      ...userData,
      password: hashedPassword,
    });
  }

  async registerUser(userData: Partial<User> = {}) {
    const defaultUser = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    return request(this.testSetup.app.getHttpServer())
      .post('/auth/register')
      .send({ ...defaultUser, ...userData });
  }

  async loginUser(credentials: { email: string; password: string }) {
    return await request(this.testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(credentials);
  }

  async getAuthenticatedUser(userData: Partial<User> = {}) {
    const user = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
      ...userData,
    };

    const registerResponse = await this.registerUser(user);
    const loginResponse = await this.loginUser({
      email: user.email,
      password: user.password,
    });

    return {
      user: registerResponse.body,
      accessToken: loginResponse.body.accessToken,
    };
  }

  async getAuthenticatedAdmin() {
    return this.getAuthenticatedUser({
      roles: [Role.ADMIN],
    });
  }

  request(accessToken?: string) {
    const agent = request(this.testSetup.app.getHttpServer());
    return {
      get: (url: string) =>
        this.authenticatedRequest(agent.get(url), accessToken),
      post: (url: string) =>
        this.authenticatedRequest(agent.post(url), accessToken),
      put: (url: string) =>
        this.authenticatedRequest(agent.put(url), accessToken),
      delete: (url: string) =>
        this.authenticatedRequest(agent.delete(url), accessToken),
      patch: (url: string) =>
        this.authenticatedRequest(agent.patch(url), accessToken),
    };
  }

  private authenticatedRequest(request: request.Test, accessToken?: string) {
    if (accessToken) {
      request.set('Authorization', `Bearer ${accessToken}`);
    }
    return request;
  }
}
