import { Router } from 'express';
import { RealtimeController, realtimeValidation } from '../controllers/realtimeController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generalLimiter, adminLimiter } from '../middleware/rateLimit.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/realtime/send-message:
 *   post:
 *     summary: Send a real-time message
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - content
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the recipient user
 *               content:
 *                 type: string
 *                 description: Message content
 *               messageType:
 *                 type: string
 *                 enum: [text, file, image, voice, system]
 *                 description: Type of message
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: File attachments
 *               replyToId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of message being replied to
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/send-message',
  authenticateToken,
  generalLimiter,
  realtimeValidation.sendMessage,
  handleValidationErrors,
  RealtimeController.sendMessage
);

/**
 * @swagger
 * /api/realtime/messages/{userId}:
 *   get:
 *     summary: Get messages between current user and specified user
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to get messages with
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/messages/:userId',
  authenticateToken,
  generalLimiter,
  RealtimeController.getMessages
);

/**
 * @swagger
 * /api/realtime/messages/{messageId}/read:
 *   put:
 *     summary: Mark a message as read
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID to mark as read
 *     responses:
 *       200:
 *         description: Message marked as read
 *       401:
 *         description: Unauthorized
 */
router.put('/messages/:messageId/read',
  authenticateToken,
  generalLimiter,
  RealtimeController.markMessageRead
);

/**
 * @swagger
 * /api/realtime/unread-count:
 *   get:
 *     summary: Get unread messages count
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
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
 *                     count:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/unread-count',
  authenticateToken,
  generalLimiter,
  RealtimeController.getUnreadCount
);

/**
 * @swagger
 * /api/realtime/conversations:
 *   get:
 *     summary: Get user conversations
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/conversations',
  authenticateToken,
  generalLimiter,
  RealtimeController.getConversations
);

/**
 * @swagger
 * /api/realtime/send-notification:
 *   post:
 *     summary: Send a notification to a user
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - title
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user to notify
 *               type:
 *                 type: string
 *                 enum: [message, company_update, funding_opportunity, event, system]
 *                 description: Type of notification
 *               title:
 *                 type: string
 *                 description: Notification title
 *               message:
 *                 type: string
 *                 description: Notification message
 *               data:
 *                 type: object
 *                 description: Additional data
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/send-notification',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  realtimeValidation.sendNotification,
  handleValidationErrors,
  RealtimeController.sendNotification
);

/**
 * @swagger
 * /api/realtime/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of notifications to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of notifications to skip
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/notifications',
  authenticateToken,
  generalLimiter,
  RealtimeController.getNotifications
);

/**
 * @swagger
 * /api/realtime/notifications/{notificationId}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notification ID to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 */
router.put('/notifications/:notificationId/read',
  authenticateToken,
  generalLimiter,
  RealtimeController.markNotificationRead
);

/**
 * @swagger
 * /api/realtime/online-users:
 *   get:
 *     summary: Get online users
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Online users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/online-users',
  authenticateToken,
  generalLimiter,
  RealtimeController.getOnlineUsers
);

/**
 * @swagger
 * /api/realtime/broadcast:
 *   post:
 *     summary: Broadcast message to all users
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - data
 *             properties:
 *               event:
 *                 type: string
 *                 description: Event name to broadcast
 *               data:
 *                 type: object
 *                 description: Data to send with the event
 *     responses:
 *       200:
 *         description: Message broadcasted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/broadcast',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  realtimeValidation.broadcastMessage,
  handleValidationErrors,
  RealtimeController.broadcastMessage
);

export default router;
