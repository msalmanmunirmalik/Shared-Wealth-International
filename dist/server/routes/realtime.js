import { Router } from 'express';
import { RealtimeController, realtimeValidation } from '../controllers/realtimeController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generalLimiter, adminLimiter } from '../middleware/rateLimit.js';
import { handleValidationErrors } from '../middleware/validation.js';
const router = Router();
router.post('/send-message', authenticateToken, generalLimiter, realtimeValidation.sendMessage, handleValidationErrors, RealtimeController.sendMessage);
router.get('/messages/:userId', authenticateToken, generalLimiter, RealtimeController.getMessages);
router.put('/messages/:messageId/read', authenticateToken, generalLimiter, RealtimeController.markMessageRead);
router.get('/unread-count', authenticateToken, generalLimiter, RealtimeController.getUnreadCount);
router.get('/conversations', authenticateToken, generalLimiter, RealtimeController.getConversations);
router.post('/send-notification', authenticateToken, requireAdmin, adminLimiter, realtimeValidation.sendNotification, handleValidationErrors, RealtimeController.sendNotification);
router.get('/notifications', authenticateToken, generalLimiter, RealtimeController.getNotifications);
router.put('/notifications/:notificationId/read', authenticateToken, generalLimiter, RealtimeController.markNotificationRead);
router.get('/online-users', authenticateToken, generalLimiter, RealtimeController.getOnlineUsers);
router.post('/broadcast', authenticateToken, requireAdmin, adminLimiter, realtimeValidation.broadcastMessage, handleValidationErrors, RealtimeController.broadcastMessage);
export default router;
//# sourceMappingURL=realtime.js.map