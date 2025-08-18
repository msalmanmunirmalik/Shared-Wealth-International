import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';
import { userValidation, paginationValidation } from '../middleware/validation.js';
import { adminLimiter, generalLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin)
 */
router.get('/stats', 
  adminLimiter,
  AdminController.getAdminStats
);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with optional pagination
 * @access  Private (Admin)
 */
router.get('/users', 
  adminLimiter,
  paginationValidation,
  AdminController.getUsers
);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin)
 */
router.get('/users/:id', 
  adminLimiter,
  userValidation.getById,
  AdminController.getUserById
);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin)
 */
router.put('/users/:id/role', 
  adminLimiter,
  userValidation.getById,
  AdminController.updateUserRole
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (Super Admin)
 */
router.delete('/users/:id', 
  requireSuperAdmin,
  adminLimiter,
  userValidation.getById,
  AdminController.deleteUser
);

/**
 * @route   POST /api/admin/companies/:id/approve
 * @desc    Approve company
 * @access  Private (Admin)
 */
router.post('/companies/:id/approve', 
  adminLimiter,
  AdminController.approveCompany
);

/**
 * @route   POST /api/admin/companies/:id/reject
 * @desc    Reject company
 * @access  Private (Admin)
 */
router.post('/companies/:id/reject', 
  adminLimiter,
  AdminController.rejectCompany
);

/**
 * @route   GET /api/admin/health
 * @desc    Get system health status
 * @access  Private (Admin)
 */
router.get('/health', 
  adminLimiter,
  AdminController.getSystemHealth
);

/**
 * @route   GET /api/admin/audit-log
 * @desc    Get audit log
 * @access  Private (Admin)
 */
router.get('/audit-log', 
  adminLimiter,
  paginationValidation,
  AdminController.getAuditLog
);

export default router;
