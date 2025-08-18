import bcrypt from 'bcryptjs';

// Mock DatabaseService module first
jest.mock('../../src/integrations/postgresql/database.js', () => ({
  DatabaseService: {
    query: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
    transaction: jest.fn(),
    healthCheck: jest.fn()
  }
}));

let AuthService: any;
let DatabaseServiceMock: any;

describe('AuthService (unit)', () => {
  beforeAll(async () => {
    // Dynamically import after mocks are set
    const svc = await import('../../services/authService');
    AuthService = svc.AuthService;
    const mockedModule = await import('../../src/integrations/postgresql/database.js');
    DatabaseServiceMock = mockedModule.DatabaseService as any;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('returns session on valid credentials', async () => {
      const password = 'testpassword123';
      const passwordHash = await bcrypt.hash(password, 12);

      DatabaseServiceMock.findOne.mockResolvedValueOnce({
        id: 'user-1',
        email: 'user@test.com',
        password_hash: passwordHash,
        role: 'user',
        created_at: new Date().toISOString()
      });

      const result = await AuthService.signIn({ email: 'user@test.com', password });

      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe('user@test.com');
      expect(result.data?.access_token).toBeTruthy();
      expect(DatabaseServiceMock.findOne).toHaveBeenCalledWith('users', { where: { email: 'user@test.com' } });
    });

    it('rejects invalid email', async () => {
      DatabaseServiceMock.findOne.mockResolvedValueOnce(null);
      const result = await AuthService.signIn({ email: 'doesnot@exist.com', password: 'x'.repeat(10) });
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
    });

    it('rejects invalid password', async () => {
      const passwordHash = await bcrypt.hash('correct', 12);
      DatabaseServiceMock.findOne.mockResolvedValueOnce({
        id: 'u1', email: 'user@test.com', password_hash: passwordHash, role: 'user', created_at: new Date().toISOString()
      });
      const result = await AuthService.signIn({ email: 'user@test.com', password: 'wrong' });
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('creates user when not existing', async () => {
      DatabaseServiceMock.findOne.mockResolvedValueOnce(null);
      DatabaseServiceMock.insert.mockResolvedValueOnce({ id: 'new-1' });
      const res = await AuthService.signUp({ email: 'new@test.com', password: 'newpassword123' });
      expect(res.success).toBe(true);
      expect(res.data?.userId).toBe('new-1');
      expect(DatabaseServiceMock.insert).toHaveBeenCalledWith('users', expect.objectContaining({ email: 'new@test.com' }));
    });

    it('rejects when user exists', async () => {
      DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 'existing' });
      const res = await AuthService.signUp({ email: 'exists@test.com', password: 'password123' });
      expect(res.success).toBe(false);
      expect(res.message).toBe('User already exists');
    });
  });

  describe('isAdmin/isSuperAdmin', () => {
    it('isAdmin true for admin and superadmin', async () => {
      DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 'a1', role: 'admin' });
      const adminRes = await AuthService.isAdmin('a1');
      expect(adminRes.success).toBe(true);
      expect(adminRes.data?.isAdmin).toBe(true);

      DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 's1', role: 'superadmin' });
      const superRes = await AuthService.isAdmin('s1');
      expect(superRes.data?.isAdmin).toBe(true);
    });

    it('isSuperAdmin only for superadmin', async () => {
      DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 's1', role: 'superadmin' });
      const res1 = await AuthService.isSuperAdmin('s1');
      expect(res1.data?.isSuperAdmin).toBe(true);

      DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 'a1', role: 'admin' });
      const res2 = await AuthService.isSuperAdmin('a1');
      expect(res2.data?.isSuperAdmin).toBe(false);
    });
  });

  describe('getUserById/updateUser', () => {
    it('getUserById returns user', async () => {
      DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 'u1', email: 'u@test.com' });
      const res = await AuthService.getUserById('u1');
      expect(res.success).toBe(true);
      expect(res.data?.email).toBe('u@test.com');
    });

    it('updateUser updates role (not password_hash)', async () => {
      DatabaseServiceMock.update.mockResolvedValueOnce({ id: 'u1', role: 'admin' });
      const res = await AuthService.updateUser('u1', { role: 'admin', password_hash: 'ignore' } as any);
      expect(res.success).toBe(true);
      expect(res.data?.role).toBe('admin');
      expect(DatabaseServiceMock.update).toHaveBeenCalledWith('users', 'u1', { role: 'admin' });
    });
  });

  describe('changePassword', () => {
    it('changes password when current matches', async () => {
      const currentHash = await bcrypt.hash('oldpass', 12);
      DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 'u1', password_hash: currentHash });
      DatabaseServiceMock.update.mockResolvedValueOnce({ id: 'u1' });
      const res = await AuthService.changePassword('u1', 'oldpass', 'newpass');
      expect(res.success).toBe(true);
      expect(DatabaseServiceMock.update).toHaveBeenCalled();
    });

    it('rejects when current password is wrong', async () => {
      const currentHash = await bcrypt.hash('oldpass', 12);
      DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 'u1', password_hash: currentHash });
      const res = await AuthService.changePassword('u1', 'wrong', 'newpass');
      expect(res.success).toBe(false);
      expect(res.message).toBe('Current password is incorrect');
    });
  });
});
