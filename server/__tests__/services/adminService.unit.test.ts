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

let AdminService: any;
let DatabaseServiceMock: any;

describe('AdminService (unit)', () => {
  beforeAll(async () => {
    const svc = await import('../../services/adminService');
    AdminService = svc.AdminService;
    const mockedModule = await import('../../src/integrations/postgresql/database.js');
    DatabaseServiceMock = mockedModule.DatabaseService as any;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAdminStats returns aggregated counts', async () => {
    DatabaseServiceMock.count
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(25)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(18);

    const res = await AdminService.getAdminStats();
    expect(res.success).toBe(true);
    expect(res.data?.totalUsers).toBe(100);
    expect(res.data?.approvedCompanies).toBe(18);
  });

  it('getUsers supports pagination', async () => {
    DatabaseServiceMock.findAll.mockResolvedValueOnce([{ id: 'u1' }]);
    DatabaseServiceMock.count.mockResolvedValueOnce(10);
    const res = await AdminService.getUsers({ page: 1, limit: 1 });
    expect(res.success).toBe(true);
    const data: any = res.data;
    expect(data.pagination.total).toBe(10);
  });

  it('getUserById returns user or not found', async () => {
    DatabaseServiceMock.findOne.mockResolvedValueOnce({ id: 'u1', email: 'a@b.com' });
    const ok = await AdminService.getUserById('u1');
    expect(ok.success).toBe(true);
    DatabaseServiceMock.findOne.mockResolvedValueOnce(null);
    const nf = await AdminService.getUserById('missing');
    expect(nf.success).toBe(false);
    expect(nf.message).toBe('User not found');
  });

  it('updateUserRole validates and updates', async () => {
    DatabaseServiceMock.update.mockResolvedValueOnce({ id: 'u1', role: 'admin' });
    const res = await AdminService.updateUserRole('u1', 'admin');
    expect(res.success).toBe(true);
    expect(res.data?.role).toBe('admin');

    const bad = await AdminService.updateUserRole('u1', 'bad' as any);
    expect(bad.success).toBe(false);
  });

  it('deleteUser deletes or returns not found', async () => {
    DatabaseServiceMock.delete.mockResolvedValueOnce(true);
    const ok = await AdminService.deleteUser('u1');
    expect(ok.success).toBe(true);
    DatabaseServiceMock.delete.mockResolvedValueOnce(false);
    const nf = await AdminService.deleteUser('u2');
    expect(nf.success).toBe(false);
    expect(nf.message).toBe('User not found');
  });

  it('approveCompany / rejectCompany update status', async () => {
    DatabaseServiceMock.update.mockResolvedValueOnce({ id: 'c1', status: 'approved' });
    const app = await AdminService.approveCompany('c1');
    expect(app.success).toBe(true);
    expect(app.data?.status).toBe('approved');

    DatabaseServiceMock.update.mockResolvedValueOnce({ id: 'c2', status: 'rejected' });
    const rej = await AdminService.rejectCompany('c2', 'bad docs');
    expect(rej.success).toBe(true);
    expect(rej.data?.status).toBe('rejected');
  });

  it('getSystemHealth returns health info', async () => {
    DatabaseServiceMock.healthCheck.mockResolvedValueOnce(true);
    const res = await AdminService.getSystemHealth();
    expect(res.success).toBe(true);
    expect(res.data?.database).toBe(true);
  });
});
