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

let CompanyService: any;
let DatabaseServiceMock: any;

describe('CompanyService (unit)', () => {
  beforeAll(async () => {
    const svc = await import('../../services/companyService');
    CompanyService = svc.CompanyService;
    const mockedModule = await import('../../src/integrations/postgresql/database.js');
    DatabaseServiceMock = mockedModule.DatabaseService as any;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getCompanies without pagination', async () => {
    DatabaseServiceMock.findAll.mockResolvedValueOnce([{ id: 'c1' }, { id: 'c2' }]);
    const res = await CompanyService.getCompanies();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    expect((res.data as any[]).length).toBe(2);
  });

  it('getCompanies with pagination', async () => {
    DatabaseServiceMock.findAll.mockResolvedValueOnce([{ id: 'c1' }]);
    DatabaseServiceMock.count.mockResolvedValueOnce(5);
    const res = await CompanyService.getCompanies({ page: 1, limit: 1 });
    expect(res.success).toBe(true);
    const data: any = res.data;
    expect(data.pagination.total).toBe(5);
    expect(data.pagination.totalPages).toBe(5);
  });

  it('getCompanyById returns company', async () => {
    DatabaseServiceMock.findById.mockResolvedValueOnce({ id: 'c1', name: 'ACME' });
    const res = await CompanyService.getCompanyById('c1');
    expect(res.success).toBe(true);
    expect(res.data?.name).toBe('ACME');
  });

  it('createCompany sets pending status', async () => {
    DatabaseServiceMock.insert.mockResolvedValueOnce({ id: 'new', status: 'pending' });
    const res = await CompanyService.createCompany({ name: 'X', description: 'D', industry: 'Tech', size: 'small', location: 'L' });
    expect(res.success).toBe(true);
    expect(res.data?.status).toBe('pending');
  });

  it('updateCompany updates fields', async () => {
    DatabaseServiceMock.update.mockResolvedValueOnce({ id: 'c1', name: 'Updated' });
    const res = await CompanyService.updateCompany('c1', { name: 'Updated' } as any);
    expect(res.success).toBe(true);
    expect(res.data?.name).toBe('Updated');
  });

  it('deleteCompany confirms deletion', async () => {
    DatabaseServiceMock.delete.mockResolvedValueOnce(true);
    const res = await CompanyService.deleteCompany('c1');
    expect(res.success).toBe(true);
  });

  it('getCompaniesByStatus filters', async () => {
    DatabaseServiceMock.findAll.mockResolvedValueOnce([{ id: 'c1', status: 'approved' }]);
    const res = await CompanyService.getCompaniesByStatus('approved');
    expect(res.success).toBe(true);
    expect((res.data as any[])[0].status).toBe('approved');
  });

  it('searchCompanies filters in-memory', async () => {
    DatabaseServiceMock.findAll.mockResolvedValueOnce([
      { id: '1', name: 'Alpha', description: 'First', industry: 'Tech' },
      { id: '2', name: 'Beta', description: 'Second', industry: 'Finance' }
    ]);
    const res = await CompanyService.searchCompanies('alp');
    expect(res.success).toBe(true);
    const results = res.data as any[];
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Alpha');
  });

  it('getCompanyStats aggregates counts', async () => {
    DatabaseServiceMock.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(1);
    const res = await CompanyService.getCompanyStats();
    expect(res.success).toBe(true);
    expect(res.data?.total).toBe(10);
    expect(res.data?.approved).toBe(6);
  });
});
