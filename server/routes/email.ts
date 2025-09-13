import { Router } from 'express';
import { EmailController, emailValidation } from '../controllers/emailController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generalLimiter, adminLimiter } from '../middleware/rateLimit.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/email/send:
 *   post:
 *     summary: Send custom email
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               template:
 *                 type: string
 *                 description: Template name
 *               templateData:
 *                 type: object
 *                 description: Data for template rendering
 *               html:
 *                 type: string
 *                 description: HTML content
 *               text:
 *                 type: string
 *                 description: Text content
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     content:
 *                       type: string
 *                     contentType:
 *                       type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/send',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  emailValidation.sendEmail,
  handleValidationErrors,
  EmailController.sendEmail
);

/**
 * @swagger
 * /api/email/welcome:
 *   post:
 *     summary: Send welcome email
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *               name:
 *                 type: string
 *                 description: Recipient name
 *               verificationUrl:
 *                 type: string
 *                 format: uri
 *                 description: Email verification URL
 *     responses:
 *       200:
 *         description: Welcome email sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/welcome',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  emailValidation.sendWelcomeEmail,
  handleValidationErrors,
  EmailController.sendWelcomeEmail
);

/**
 * @swagger
 * /api/email/password-reset:
 *   post:
 *     summary: Send password reset email
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - resetUrl
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *               name:
 *                 type: string
 *                 description: Recipient name
 *               resetUrl:
 *                 type: string
 *                 format: uri
 *                 description: Password reset URL
 *               expiryHours:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 168
 *                 description: Link expiry hours
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/password-reset',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  emailValidation.sendPasswordResetEmail,
  handleValidationErrors,
  EmailController.sendPasswordResetEmail
);

/**
 * @swagger
 * /api/email/company-approval:
 *   post:
 *     summary: Send company approval email
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - companyName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *               name:
 *                 type: string
 *                 description: Recipient name
 *               companyName:
 *                 type: string
 *                 description: Company name
 *     responses:
 *       200:
 *         description: Company approval email sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/company-approval',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  emailValidation.sendCompanyApprovalEmail,
  handleValidationErrors,
  EmailController.sendCompanyApprovalEmail
);

/**
 * @swagger
 * /api/email/company-rejection:
 *   post:
 *     summary: Send company rejection email
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - companyName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *               name:
 *                 type: string
 *                 description: Recipient name
 *               companyName:
 *                 type: string
 *                 description: Company name
 *               reason:
 *                 type: string
 *                 description: Rejection reason
 *     responses:
 *       200:
 *         description: Company rejection email sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/company-rejection',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  emailValidation.sendCompanyRejectionEmail,
  handleValidationErrors,
  EmailController.sendCompanyRejectionEmail
);

/**
 * @swagger
 * /api/email/notification:
 *   post:
 *     summary: Send notification email
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               message:
 *                 type: string
 *                 description: Email message
 *               actionUrl:
 *                 type: string
 *                 format: uri
 *                 description: Action URL
 *               actionText:
 *                 type: string
 *                 description: Action button text
 *     responses:
 *       200:
 *         description: Notification email sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/notification',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  emailValidation.sendNotificationEmail,
  handleValidationErrors,
  EmailController.sendNotificationEmail
);

/**
 * @swagger
 * /api/email/test:
 *   get:
 *     summary: Test email service
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email service test successful
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
 *                     templates:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Email service test failed
 */
router.get('/test',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  EmailController.testEmailService
);

/**
 * @swagger
 * /api/email/templates:
 *   get:
 *     summary: Get available email templates
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
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
 *                     templates:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/templates',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  EmailController.getEmailTemplates
);

export default router;
