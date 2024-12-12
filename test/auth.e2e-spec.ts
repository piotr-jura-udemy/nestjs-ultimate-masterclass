import { Role } from './../src/users/enums/role.enum';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { PasswordService } from '../src/users/password/password.service';

describe('AppController (e2e)', () => {
  let testSetup: TestSetup;

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
  };

  it('/auth/register (POST)', () => {
    return request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.name).toBe(testUser.name);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/register (POST) - duplicate email', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    return await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409);
  });

  it('/auth/login (POST)', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
  });

  it('/auth/profile (GET)', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const token = response.body.accessToken;

    return await request(testSetup.app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.name).toBe(testUser.name);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/admin (GET) - admin access', async () => {
    // Create admin user directly via service
    const adminUser = {
      email: 'admin@test.com',
      password: 'password123',
      name: 'Admin User',
      roles: [Role.ADMIN],
    };

    const userRepo = testSetup.app.get(getRepositoryToken(User));
    console.log(
      await userRepo.save({
        ...adminUser,
        password: await testSetup.app
          .get(PasswordService)
          .hash(adminUser.password),
      }),
    );

    // Login as admin
    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });

    expect(loginResponse.status).toBe(201);

    const adminToken = loginResponse.body.accessToken;

    // Test admin route
    return request(testSetup.app.getHttpServer())
      .get('/auth/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        console.log(res.body);
        expect(res.body.message).toBe('Admin only route');
      });
  });

  it('/auth/admin (GET) - regular user denied', async () => {
    // Register regular user
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const userToken = loginResponse.body.accessToken;

    // Test admin route with regular user token
    return request(testSetup.app.getHttpServer())
      .get('/auth/admin')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
