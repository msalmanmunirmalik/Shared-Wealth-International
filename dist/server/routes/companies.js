import { Router } from 'express';
import { CompanyController } from '../controllers/companyController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { companyValidation, handleValidationErrors, searchValidation } from '../middleware/validation.js';
import { generalLimiter, adminLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.get('/', generalLimiter, CompanyController.getCompanies);
router.get('/user', authenticateToken, generalLimiter, CompanyController.getUserCompanies);
router.get('/applications', authenticateToken, generalLimiter, CompanyController.getUserApplications);
router.get('/search', generalLimiter, searchValidation, handleValidationErrors, CompanyController.searchCompanies);
router.get('/stats', generalLimiter, CompanyController.getCompanyStats);
router.get('/status/:status', generalLimiter, CompanyController.getCompaniesByStatus);
router.get('/:id', generalLimiter, companyValidation.getById, handleValidationErrors, CompanyController.getCompanyById);
router.post('/', authenticateToken, generalLimiter, companyValidation.create, handleValidationErrors, CompanyController.createCompany);
router.put('/:id', authenticateToken, generalLimiter, companyValidation.update, handleValidationErrors, CompanyController.updateCompany);
router.delete('/:id', authenticateToken, requireAdmin, adminLimiter, companyValidation.getById, handleValidationErrors, CompanyController.deleteCompany);
export default router;
//# sourceMappingURL=companies.js.map