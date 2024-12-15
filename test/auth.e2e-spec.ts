import { Role } from './../src/users/role.enum';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { JwtService } from '@nestjs/jwt';

describe('Authentication & Authorization (e2e)', () => {
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

  it('should require auth', () => {
    return testSetup.auth.request().get('/tasks').expect(401);
  });

  it('should allow public route access', async () => {
    const { user } = await testSetup.auth.getAuthenticatedUser();
    expect(user).toBeDefined();
  });

  it('should include roles in JWT token', async () => {
    const { accessToken } = await testSetup.auth.getAuthenticatedAdmin();

    const decoded = testSetup.app.get(JwtService).verify(accessToken);
    expect(decoded.roles).toBeDefined();
    expect(decoded.roles).toContain(Role.ADMIN);
  });

  it('/auth/register (POST) - normal registration', async () => {
    const userData = { email: 'new@example.com' };
    const response = await testSetup.auth.registerUser(userData);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).not.toHaveProperty('password');
  });

  it('/auth/register (POST) - duplicate email', async () => {
    const userData = { email: 'duplicate@example.com' };
    await testSetup.auth.registerUser(userData);
    const response = await testSetup.auth.registerUser(userData);
    expect(response.status).toBe(409);
  });

  it('/auth/login (POST)', async () => {
    const userData = { email: 'new@example.com' };
    const { accessToken, user } =
      await testSetup.auth.getAuthenticatedUser(userData);
    expect(accessToken).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user).not.toHaveProperty('password');
  });

  it('/auth/profile (GET)', async () => {
    const { user, accessToken } = await testSetup.auth.getAuthenticatedUser();

    return testSetup.auth
      .request(accessToken)
      .get('/auth/profile')
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(user.email);
        expect(res.body.name).toBe(user.name);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/admin (GET) - admin access', async () => {
    const { accessToken } = await testSetup.auth.getAuthenticatedAdmin();

    return testSetup.auth
      .request(accessToken)
      .get('/auth/admin')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('This is for admins only!');
      });
  });

  it('/auth/admin (GET) - regular user denied', async () => {
    const { accessToken } = await testSetup.auth.getAuthenticatedUser();

    return testSetup.auth.request(accessToken).get('/auth/admin').expect(403);
  });
});
