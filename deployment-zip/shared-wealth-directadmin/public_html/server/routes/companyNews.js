import { Router } from 'express';
import { CompanyNewsController } from '../controllers/companyNewsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.get('/', generalLimiter, CompanyNewsController.getAllCompanyNews);
router.get('/companies/:companyId/news', generalLimiter, CompanyNewsController.getCompanyNews);
router.post('/companies/:companyId/news', authenticateToken, generalLimiter, CompanyNewsController.createCompanyPost);
router.put('/companies/:companyId/news/:postId', authenticateToken, generalLimiter, CompanyNewsController.updateCompanyPost);
router.delete('/companies/:companyId/news/:postId', authenticateToken, generalLimiter, CompanyNewsController.deleteCompanyPost);
export default router;
//# sourceMappingURL=companyNews.js.map