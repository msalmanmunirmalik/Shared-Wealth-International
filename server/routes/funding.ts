import { Router } from 'express';
import { FundingController } from '../controllers/fundingController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { paginationValidation, handleValidationErrors } from '../middleware/validation.js';
import { adminLimiter, generalLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

// All funding management routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/funding/applications
 * @desc    Get all funding applications with optional pagination and filters
 * @access  Private (Admin)
 */
router.get('/applications', 
  adminLimiter,
  paginationValidation,
  handleValidationErrors,
  FundingController.getFundingApplications
);

/**
 * @route   GET /api/admin/funding/applications/:id
 * @desc    Get a specific funding application by ID
 * @access  Private (Admin)
 */
router.get('/applications/:id', 
  adminLimiter,
  FundingController.getFundingApplicationById
);

/**
 * @route   POST /api/admin/funding/applications
 * @desc    Create a new funding application
 * @access  Private (Admin)
 */
router.post('/applications', 
  adminLimiter,
  FundingController.createFundingApplication
);

/**
 * @route   PUT /api/admin/funding/applications/:id
 * @desc    Update a funding application
 * @access  Private (Admin)
 */
router.put('/applications/:id', 
  adminLimiter,
  FundingController.updateFundingApplication
);

/**
 * @route   POST /api/admin/funding/applications/:id/approve
 * @desc    Approve a funding application
 * @access  Private (Admin)
 */
router.post('/applications/:id/approve', 
  adminLimiter,
  FundingController.approveFundingApplication
);

/**
 * @route   POST /api/admin/funding/applications/:id/reject
 * @desc    Reject a funding application
 * @access  Private (Admin)
 */
router.post('/applications/:id/reject', 
  adminLimiter,
  FundingController.rejectFundingApplication
);

/**
 * @route   DELETE /api/admin/funding/applications/:id
 * @desc    Delete a funding application
 * @access  Private (Admin)
 */
router.delete('/applications/:id', 
  adminLimiter,
  FundingController.deleteFundingApplication
);

/**
 * @route   GET /api/admin/funding/opportunities-with-stats
 * @desc    Get funding opportunities with application statistics
 * @access  Private (Admin)
 */
router.get('/opportunities-with-stats', 
  adminLimiter,
  paginationValidation,
  handleValidationErrors,
  FundingController.getFundingOpportunitiesWithStats
);

/**
 * @route   GET /api/admin/funding/analytics
 * @desc    Get comprehensive funding analytics
 * @access  Private (Admin)
 */
router.get('/analytics', 
  adminLimiter,
  FundingController.getFundingAnalytics
);

export default router;
