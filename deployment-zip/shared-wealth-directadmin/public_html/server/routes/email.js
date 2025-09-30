import { Router } from 'express';
import { EmailController, emailValidation } from '../controllers/emailController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimit.js';
import { handleValidationErrors } from '../middleware/validation.js';
const router = Router();
router.post('/send', authenticateToken, requireAdmin, adminLimiter, emailValidation.sendEmail, handleValidationErrors, EmailController.sendEmail);
router.post('/welcome', authenticateToken, requireAdmin, adminLimiter, emailValidation.sendWelcomeEmail, handleValidationErrors, EmailController.sendWelcomeEmail);
router.post('/password-reset', authenticateToken, requireAdmin, adminLimiter, emailValidation.sendPasswordResetEmail, handleValidationErrors, EmailController.sendPasswordResetEmail);
router.post('/company-approval', authenticateToken, requireAdmin, adminLimiter, emailValidation.sendCompanyApprovalEmail, handleValidationErrors, EmailController.sendCompanyApprovalEmail);
router.post('/company-rejection', authenticateToken, requireAdmin, adminLimiter, emailValidation.sendCompanyRejectionEmail, handleValidationErrors, EmailController.sendCompanyRejectionEmail);
router.post('/notification', authenticateToken, requireAdmin, adminLimiter, emailValidation.sendNotificationEmail, handleValidationErrors, EmailController.sendNotificationEmail);
router.get('/test', authenticateToken, requireAdmin, adminLimiter, EmailController.testEmailService);
router.get('/templates', authenticateToken, requireAdmin, adminLimiter, EmailController.getEmailTemplates);
export default router;
//# sourceMappingURL=email.js.map