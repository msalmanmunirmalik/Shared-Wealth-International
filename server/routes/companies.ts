import { Router } from 'express';
import { CompanyController } from '../controllers/companyController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { companyValidation, handleValidationErrors, paginationValidation, searchValidation } from '../middleware/validation.js';
import { generalLimiter, adminLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies with optional pagination
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 */
router.get('/', generalLimiter, paginationValidation, handleValidationErrors, CompanyController.getCompanies);

/**
 * @swagger
 * /api/companies/user:
 *   get:
 *     summary: Get companies for the authenticated user
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       401:
 *         description: Unauthorized
 */
router.get('/user', authenticateToken, generalLimiter, CompanyController.getUserCompanies);

/**
 * @swagger
 * /api/companies/applications:
 *   get:
 *     summary: Get company applications for the authenticated user
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User company applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyApplication'
 *       401:
 *         description: Unauthorized
 */
router.get('/applications', authenticateToken, generalLimiter, CompanyController.getUserApplications);

/**
 * @swagger
 * /api/companies/search:
 *   get:
 *     summary: Search companies by name, description, or industry
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Industry category filter
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 */
router.get('/search', generalLimiter, searchValidation, handleValidationErrors, CompanyController.searchCompanies);

/**
 * @swagger
 * /api/companies/stats:
 *   get:
 *     summary: Get company statistics
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Company statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     approved:
 *                       type: integer
 *                     rejected:
 *                       type: integer
 */
router.get('/stats', generalLimiter, CompanyController.getCompanyStats);

/**
 * @swagger
 * /api/companies/status/{status}:
 *   get:
 *     summary: Get companies by status
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Company status
 *     responses:
 *       200:
 *         description: Companies with specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 */
router.get('/status/:status', generalLimiter, CompanyController.getCompaniesByStatus);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
router.get('/:id', generalLimiter, companyValidation.getById, handleValidationErrors, CompanyController.getCompanyById);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - industry
 *               - size
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 description: Company name
 *               description:
 *                 type: string
 *                 description: Company description
 *               industry:
 *                 type: string
 *                 description: Industry sector
 *               size:
 *                 type: string
 *                 enum: [startup, small, medium, large]
 *                 description: Company size
 *               location:
 *                 type: string
 *                 description: Company location
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, generalLimiter, companyValidation.create, handleValidationErrors, CompanyController.createCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [startup, small, medium, large]
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router.put('/:id', authenticateToken, generalLimiter, companyValidation.update, handleValidationErrors, CompanyController.updateCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete company (Admin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Company not found
 */
router.delete('/:id', authenticateToken, requireAdmin, adminLimiter, companyValidation.getById, handleValidationErrors, CompanyController.deleteCompany);

export default router;
