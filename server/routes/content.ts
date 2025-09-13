import { Router } from 'express';
import { ContentController } from '../controllers/contentController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { paginationValidation, handleValidationErrors } from '../middleware/validation.js';
import { adminLimiter, generalLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

// All content management routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/content/funding-opportunities
 * @desc    Get all funding opportunities with optional pagination
 * @access  Private (Admin)
 */
router.get('/funding-opportunities', 
  adminLimiter,
  paginationValidation,
  handleValidationErrors,
  ContentController.getFundingOpportunities
);

/**
 * @route   POST /api/admin/content/funding-opportunities
 * @desc    Create a new funding opportunity
 * @access  Private (Admin)
 */
router.post('/funding-opportunities', 
  adminLimiter,
  ContentController.createFundingOpportunity
);

/**
 * @route   PUT /api/admin/content/funding-opportunities/:id
 * @desc    Update a funding opportunity
 * @access  Private (Admin)
 */
router.put('/funding-opportunities/:id', 
  adminLimiter,
  ContentController.updateFundingOpportunity
);

/**
 * @route   DELETE /api/admin/content/funding-opportunities/:id
 * @desc    Delete a funding opportunity
 * @access  Private (Admin)
 */
router.delete('/funding-opportunities/:id', 
  adminLimiter,
  ContentController.deleteFundingOpportunity
);

/**
 * @route   GET /api/admin/content/news-articles
 * @desc    Get all news articles with optional pagination
 * @access  Private (Admin)
 */
router.get('/news-articles', 
  adminLimiter,
  paginationValidation,
  handleValidationErrors,
  ContentController.getNewsArticles
);

/**
 * @route   POST /api/admin/content/news-articles
 * @desc    Create a new news article
 * @access  Private (Admin)
 */
router.post('/news-articles', 
  adminLimiter,
  ContentController.createNewsArticle
);

/**
 * @route   PUT /api/admin/content/news-articles/:id
 * @desc    Update a news article
 * @access  Private (Admin)
 */
router.put('/news-articles/:id', 
  adminLimiter,
  ContentController.updateNewsArticle
);

/**
 * @route   DELETE /api/admin/content/news-articles/:id
 * @desc    Delete a news article
 * @access  Private (Admin)
 */
router.delete('/news-articles/:id', 
  adminLimiter,
  ContentController.deleteNewsArticle
);

/**
 * @route   GET /api/admin/content/events
 * @desc    Get all events with optional pagination
 * @access  Private (Admin)
 */
router.get('/events', 
  adminLimiter,
  paginationValidation,
  handleValidationErrors,
  ContentController.getEvents
);

/**
 * @route   POST /api/admin/content/events
 * @desc    Create a new event
 * @access  Private (Admin)
 */
router.post('/events', 
  adminLimiter,
  ContentController.createEvent
);

/**
 * @route   PUT /api/admin/content/events/:id
 * @desc    Update an event
 * @access  Private (Admin)
 */
router.put('/events/:id', 
  adminLimiter,
  ContentController.updateEvent
);

/**
 * @route   DELETE /api/admin/content/events/:id
 * @desc    Delete an event
 * @access  Private (Admin)
 */
router.delete('/events/:id', 
  adminLimiter,
  ContentController.deleteEvent
);

export default router;
