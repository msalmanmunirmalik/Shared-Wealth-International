import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { webSocketService } from '../services/webSocketService.js';
import { ApiResponse } from '../types/index.js';
import { body, validationResult } from 'express-validator';

export class RealtimeController {
  /**
   * Send message
   */
  static async sendMessage(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { recipientId, content, messageType = 'text', attachments, replyToId } = req.body;
      const senderId = req.user?.id;

      if (!senderId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Save message to database
      const messageRecord = await DatabaseService.insert('messages', {
        sender_id: senderId,
        recipient_id: recipientId,
        content: content,
        message_type: messageType,
        is_read: false
      });

      // Send via WebSocket
      webSocketService.sendToUser(recipientId, 'new_message', {
        id: messageRecord.id,
        senderId: senderId,
        recipientId: recipientId,
        content: content,
        messageType: messageType,
        attachments: attachments,
        replyToId: replyToId,
        createdAt: new Date()
      });

      res.json({
        success: true,
        data: {
          id: messageRecord.id,
          senderId: senderId,
          recipientId: recipientId,
          content: content,
          messageType: messageType,
          attachments: attachments,
          replyToId: replyToId,
          createdAt: messageRecord.created_at
        }
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get messages between users
   */
  static async getMessages(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Get messages between current user and specified user
      const messages = await DatabaseService.query(`
        SELECT m.*, 
               sender.first_name as sender_first_name,
               sender.last_name as sender_last_name,
               sender.email as sender_email,
               recipient.first_name as recipient_first_name,
               recipient.last_name as recipient_last_name,
               recipient.email as recipient_email
        FROM messages m
        LEFT JOIN users sender ON m.sender_id = sender.id
        LEFT JOIN users recipient ON m.recipient_id = recipient.id
        WHERE (m.sender_id = $1 AND m.recipient_id = $2) 
           OR (m.sender_id = $2 AND m.recipient_id = $1)
        ORDER BY m.created_at ASC
      `, [currentUserId, userId]);

      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Mark message as read
   */
  static async markMessageRead(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const { messageId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Update message as read
      await DatabaseService.update('messages', messageId, {
        is_read: true,
        read_at: new Date()
      });

      // Notify sender via WebSocket
      const message = await DatabaseService.findById('messages', messageId);
      if (message) {
        webSocketService.sendToUser(message.sender_id, 'message_read', {
          messageId: messageId,
          readAt: new Date()
        });
      }

      res.json({
        success: true,
        data: { message: 'Message marked as read' }
      });
    } catch (error) {
      console.error('Mark message read error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get unread messages count
   */
  static async getUnreadCount(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const unreadCount = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM messages
        WHERE recipient_id = $1 AND is_read = false
      `, [userId]);

      res.json({
        success: true,
        data: { count: parseInt(unreadCount[0].count) }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get conversations
   */
  static async getConversations(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Get conversations with last message
      const conversations = await DatabaseService.query(`
        WITH last_messages AS (
          SELECT DISTINCT ON (
            CASE 
              WHEN sender_id = $1 THEN recipient_id 
              ELSE sender_id 
            END
          )
          CASE 
            WHEN sender_id = $1 THEN recipient_id 
            ELSE sender_id 
          END as other_user_id,
          content,
          created_at,
          is_read,
          sender_id
          FROM messages
          WHERE sender_id = $1 OR recipient_id = $1
          ORDER BY 
            CASE 
              WHEN sender_id = $1 THEN recipient_id 
              ELSE sender_id 
            END,
            created_at DESC
        )
        SELECT 
          lm.other_user_id,
          u.first_name,
          u.last_name,
          u.email,
          lm.content as last_message,
          lm.created_at as last_message_at,
          lm.is_read,
          lm.sender_id = $1 as is_sent_by_me,
          CASE 
            WHEN lm.sender_id = $1 THEN 'sent'
            WHEN lm.is_read = false THEN 'unread'
            ELSE 'read'
          END as status
        FROM last_messages lm
        JOIN users u ON lm.other_user_id = u.id
        ORDER BY lm.created_at DESC
      `, [userId]);

      res.json({
        success: true,
        data: conversations
      });
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Send notification
   */
  static async sendNotification(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { userId, type, title, message, data } = req.body;
      const senderId = req.user?.id;

      if (!senderId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Only admins can send notifications
      if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      // Save notification to database
      const notificationRecord = await DatabaseService.insert('activity_feed', {
        user_id: userId,
        activity_type: type,
        activity_data: {
          title: title,
          message: message,
          ...data
        },
        is_read: false
      });

      // Send via WebSocket
      webSocketService.sendToUser(userId, 'new_notification', {
        id: notificationRecord.id,
        userId: userId,
        type: type,
        title: title,
        message: message,
        data: data,
        createdAt: new Date()
      });

      res.json({
        success: true,
        data: {
          id: notificationRecord.id,
          userId: userId,
          type: type,
          title: title,
          message: message,
          data: data,
          createdAt: notificationRecord.created_at
        }
      });
    } catch (error) {
      console.error('Send notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get notifications
   */
  static async getNotifications(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const userId = req.user?.id;
      const { limit = 50, offset = 0 } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const notifications = await DatabaseService.findAll('activity_feed', {
        where: { user_id: userId },
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Mark notification as read
   */
  static async markNotificationRead(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      await DatabaseService.update('activity_feed', notificationId, {
        is_read: true
      });

      res.json({
        success: true,
        data: { message: 'Notification marked as read' }
      });
    } catch (error) {
      console.error('Mark notification read error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get online users
   */
  static async getOnlineUsers(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const onlineUsers = webSocketService.getOnlineUsers();

      res.json({
        success: true,
        data: onlineUsers
      });
    } catch (error) {
      console.error('Get online users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Broadcast message to all users
   */
  static async broadcastMessage(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { event, data } = req.body;

      // Only admins can broadcast
      if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      webSocketService.broadcast(event, data);

      res.json({
        success: true,
        data: { message: 'Message broadcasted successfully' }
      });
    } catch (error) {
      console.error('Broadcast message error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

// Validation rules
export const realtimeValidation = {
  sendMessage: [
    body('recipientId')
      .isUUID()
      .withMessage('Valid recipient ID is required'),
    body('content')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Content must be between 1 and 1000 characters'),
    body('messageType')
      .optional()
      .isIn(['text', 'file', 'image', 'voice', 'system'])
      .withMessage('Invalid message type'),
    body('attachments')
      .optional()
      .isArray()
      .withMessage('Attachments must be an array'),
    body('replyToId')
      .optional()
      .isUUID()
      .withMessage('Reply to ID must be a valid UUID')
  ],

  sendNotification: [
    body('userId')
      .isUUID()
      .withMessage('Valid user ID is required'),
    body('type')
      .isIn(['message', 'company_update', 'funding_opportunity', 'event', 'system'])
      .withMessage('Invalid notification type'),
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('message')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Message must be between 1 and 500 characters'),
    body('data')
      .optional()
      .isObject()
      .withMessage('Data must be an object')
  ],

  broadcastMessage: [
    body('event')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Event name must be between 1 and 100 characters'),
    body('data')
      .isObject()
      .withMessage('Data must be an object')
  ]
};
