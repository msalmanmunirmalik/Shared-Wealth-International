import { Router } from 'express';
import { FundingController } from '../controllers/fundingController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { paginationValidation, handleValidationErrors } from '../middleware/validation.js';
import { adminLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.use(authenticateToken);
router.use(requireAdmin);
router.get('/applications', adminLimiter, paginationValidation, handleValidationErrors, FundingController.getFundingApplications);
router.get('/applications/:id', adminLimiter, FundingController.getFundingApplicationById);
router.post('/applications', adminLimiter, FundingController.createFundingApplication);
router.put('/applications/:id', adminLimiter, FundingController.updateFundingApplication);
router.post('/applications/:id/approve', adminLimiter, FundingController.approveFundingApplication);
router.post('/applications/:id/reject', adminLimiter, FundingController.rejectFundingApplication);
router.delete('/applications/:id', adminLimiter, FundingController.deleteFundingApplication);
router.get('/opportunities-with-stats', adminLimiter, paginationValidation, handleValidationErrors, FundingController.getFundingOpportunitiesWithStats);
router.get('/analytics', adminLimiter, FundingController.getFundingAnalytics);
export default router;
//# sourceMappingURL=funding.js.map