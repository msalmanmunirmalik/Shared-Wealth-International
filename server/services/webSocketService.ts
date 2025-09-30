import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { log } from '../middleware/logger.js';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userEmail?: string;
}

export interface SocketUser {
  userId: string;
  userRole: string;
  userEmail: string;
  socketId: string;
  isOnline: boolean;
  lastSeen: Date;
  currentRoom?: string;
}

export interface MessageData {
  id?: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'voice' | 'system';
  attachments?: string[];
  replyToId?: string;
  createdAt?: Date;
}

export interface NotificationData {
  id?: string;
  userId: string;
  type: 'message' | 'company_update' | 'funding_opportunity' | 'event' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead?: boolean;
  createdAt?: Date;
}

export interface ActivityData {
  id?: string;
  userId: string;
  activityType: string;
  activityData: Record<string, any>;
  isRead?: boolean;
  createdAt?: Date;
}

class WebSocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  /**
   * Initialize WebSocket server
   */
  initialize(httpServer: HTTPServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    log.info('WebSocket service initialized successfully');
  }

  /**
   * Setup authentication middleware
   */
  private setupMiddleware(): void {
    if (!this.io) return;

    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key') as any;
        
        // Verify user exists in database
        const user = await DatabaseService.findById('users', decoded.userId);
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
        socket.userEmail = decoded.email;

        next();
      } catch (error) {
        log.error('WebSocket authentication error', { error: error instanceof Error ? error.message : error });
        next(new Error('Invalid authentication token'));
      }
    });
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      this.handleConnection(socket);
    });
  }

  /**
   * Handle new connection
   */
  private handleConnection(socket: AuthenticatedSocket): void {
    if (!socket.userId) return;

    const user: SocketUser = {
      userId: socket.userId,
      userRole: socket.userRole || 'user',
      userEmail: socket.userEmail || '',
      socketId: socket.id,
      isOnline: true,
      lastSeen: new Date()
    };

    this.connectedUsers.set(socket.id, user);
    this.userSockets.set(socket.userId, socket.id);

    log.info('User connected to WebSocket', {
      userId: socket.userId,
      socketId: socket.id,
      userRole: socket.userRole
    });

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Join admin users to admin room
    if (socket.userRole === 'admin' || socket.userRole === 'superadmin') {
      socket.join('admin');
    }

    // Send online status to contacts
    this.broadcastUserStatus(socket.userId, true);

    // Send unread notifications
    this.sendUnreadNotifications(socket);

    // Setup event handlers for this socket
    this.setupSocketEventHandlers(socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      this.handleDisconnection(socket);
    });
  }

  /**
   * Setup individual socket event handlers
   */
  private setupSocketEventHandlers(socket: AuthenticatedSocket): void {
    if (!socket.userId) return;

    // Join room
    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      const user = this.connectedUsers.get(socket.id);
      if (user) {
        user.currentRoom = roomId;
      }
      log.info('User joined room', { userId: socket.userId, roomId });
    });

    // Leave room
    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      const user = this.connectedUsers.get(socket.id);
      if (user) {
        user.currentRoom = undefined;
      }
      log.info('User left room', { userId: socket.userId, roomId });
    });

    // Send message
    socket.on('send_message', async (data: MessageData) => {
      await this.handleSendMessage(socket, data);
    });

    // Typing indicator
    socket.on('typing_start', (data: { recipientId: string }) => {
      this.handleTypingStart(socket, data.recipientId);
    });

    socket.on('typing_stop', (data: { recipientId: string }) => {
      this.handleTypingStop(socket, data.recipientId);
    });

    // Mark message as read
    socket.on('mark_message_read', async (data: { messageId: string }) => {
      await this.handleMarkMessageRead(socket, data.messageId);
    });

    // Send notification
    socket.on('send_notification', async (data: NotificationData) => {
      await this.handleSendNotification(socket, data);
    });

    // Update activity
    socket.on('update_activity', async (data: ActivityData) => {
      await this.handleUpdateActivity(socket, data);
    });

    // Get online users
    socket.on('get_online_users', () => {
      this.handleGetOnlineUsers(socket);
    });

    // Ping/Pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });
  }

  /**
   * Handle disconnection
   */
  private handleDisconnection(socket: AuthenticatedSocket): void {
    if (!socket.userId) return;

    const user = this.connectedUsers.get(socket.id);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
    }

    this.connectedUsers.delete(socket.id);
    this.userSockets.delete(socket.userId);

    log.info('User disconnected from WebSocket', {
      userId: socket.userId,
      socketId: socket.id
    });

    // Send offline status to contacts
    this.broadcastUserStatus(socket.userId, false);
  }

  /**
   * Handle send message
   */
  private async handleSendMessage(socket: AuthenticatedSocket, data: MessageData): Promise<void> {
    try {
      if (!socket.userId) return;

      // Save message to database
      const messageRecord = await DatabaseService.insert('messages', {
        sender_id: socket.userId,
        recipient_id: data.recipientId,
        content: data.content,
        message_type: data.messageType || 'message',
        is_read: false
      });

      const messageData: MessageData = {
        id: messageRecord.id,
        senderId: socket.userId,
        recipientId: data.recipientId,
        content: data.content,
        messageType: data.messageType || 'text',
        attachments: data.attachments,
        replyToId: data.replyToId,
        createdAt: new Date()
      };

      // Send to recipient if online
      const recipientSocketId = this.userSockets.get(data.recipientId);
      if (recipientSocketId) {
        this.io?.to(recipientSocketId).emit('new_message', messageData);
      }

      // Send confirmation to sender
      socket.emit('message_sent', messageData);

      // Create notification for recipient
      await this.createNotification({
        userId: data.recipientId,
        type: 'message',
        title: 'New Message',
        message: `You have a new message from ${socket.userEmail}`,
        data: { messageId: messageRecord.id, senderId: socket.userId }
      });

      log.info('Message sent successfully', {
        senderId: socket.userId,
        recipientId: data.recipientId,
        messageId: messageRecord.id
      });
    } catch (error) {
      log.error('Error sending message', { error: error instanceof Error ? error.message : error });
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  }

  /**
   * Handle typing start
   */
  private handleTypingStart(socket: AuthenticatedSocket, recipientId: string): void {
    const recipientSocketId = this.userSockets.get(recipientId);
    if (recipientSocketId) {
      this.io?.to(recipientSocketId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true
      });
    }
  }

  /**
   * Handle typing stop
   */
  private handleTypingStop(socket: AuthenticatedSocket, recipientId: string): void {
    const recipientSocketId = this.userSockets.get(recipientId);
    if (recipientSocketId) {
      this.io?.to(recipientSocketId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      });
    }
  }

  /**
   * Handle mark message as read
   */
  private async handleMarkMessageRead(socket: AuthenticatedSocket, messageId: string): Promise<void> {
    try {
      await DatabaseService.update('messages', messageId, {
        is_read: true,
        read_at: new Date()
      });

      socket.emit('message_read', { messageId });
    } catch (error) {
      log.error('Error marking message as read', { error: error instanceof Error ? error.message : error });
    }
  }

  /**
   * Handle send notification
   */
  private async handleSendNotification(socket: AuthenticatedSocket, data: NotificationData): Promise<void> {
    try {
      if (!socket.userId) return;

      // Only admins can send notifications
      if (socket.userRole !== 'admin' && socket.userRole !== 'superadmin') {
        socket.emit('error', { message: 'Unauthorized to send notifications' });
        return;
      }

      await this.createNotification(data);

      // Send to specific user if online
      if (data.userId) {
        const userSocketId = this.userSockets.get(data.userId);
        if (userSocketId) {
          this.io?.to(userSocketId).emit('new_notification', data);
        }
      } else {
        // Broadcast to all users
        this.io?.emit('new_notification', data);
      }

      log.info('Notification sent', { type: data.type, userId: data.userId });
    } catch (error) {
      log.error('Error sending notification', { error: error instanceof Error ? error.message : error });
    }
  }

  /**
   * Handle update activity
   */
  private async handleUpdateActivity(socket: AuthenticatedSocket, data: ActivityData): Promise<void> {
    try {
      if (!socket.userId) return;

      // Save activity to database
      const activityRecord = await DatabaseService.insert('activity_feed', {
        user_id: socket.userId,
        activity_type: data.activityType,
        activity_data: data.activityData,
        is_read: false
      });

      // Broadcast to user's contacts
      this.broadcastActivity(socket.userId, {
        id: activityRecord.id,
        userId: socket.userId,
        activityType: data.activityType,
        activityData: data.activityData,
        createdAt: new Date()
      });

      log.info('Activity updated', { userId: socket.userId, activityType: data.activityType });
    } catch (error) {
      log.error('Error updating activity', { error: error instanceof Error ? error.message : error });
    }
  }

  /**
   * Handle get online users
   */
  private handleGetOnlineUsers(socket: AuthenticatedSocket): void {
    const onlineUsers = Array.from(this.connectedUsers.values())
      .filter(user => user.isOnline)
      .map(user => ({
        userId: user.userId,
        userEmail: user.userEmail,
        userRole: user.userRole,
        lastSeen: user.lastSeen
      }));

    socket.emit('online_users', onlineUsers);
  }

  /**
   * Send unread notifications to user
   */
  private async sendUnreadNotifications(socket: AuthenticatedSocket): Promise<void> {
    try {
      if (!socket.userId) return;

      const notifications = await DatabaseService.findAll('activity_feed', {
        where: { user_id: socket.userId, is_read: false }
      });

      socket.emit('unread_notifications', notifications);
    } catch (error) {
      log.error('Error fetching unread notifications', { error: error instanceof Error ? error.message : error });
    }
  }

  /**
   * Broadcast user status to contacts
   */
  private broadcastUserStatus(userId: string, isOnline: boolean): void {
    const userSocketId = this.userSockets.get(userId);
    if (userSocketId) {
      this.io?.to(`user:${userId}`).emit('user_status', {
        userId,
        isOnline,
        lastSeen: new Date()
      });
    }
  }

  /**
   * Broadcast activity to contacts
   */
  private broadcastActivity(userId: string, activity: any): void {
    this.io?.to(`user:${userId}`).emit('new_activity', activity);
  }

  /**
   * Create notification in database
   */
  private async createNotification(data: NotificationData): Promise<void> {
    await DatabaseService.insert('activity_feed', {
      user_id: data.userId,
      activity_type: data.type,
      activity_data: {
        title: data.title,
        message: data.message,
        ...data.data
      },
      is_read: data.isRead || false
    });
  }

  /**
   * Send message to specific user
   */
  public sendToUser(userId: string, event: string, data: any): void {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io?.to(socketId).emit(event, data);
    }
  }

  /**
   * Send message to room
   */
  public sendToRoom(roomId: string, event: string, data: any): void {
    this.io?.to(roomId).emit(event, data);
  }

  /**
   * Broadcast to all users
   */
  public broadcast(event: string, data: any): void {
    this.io?.emit(event, data);
  }

  /**
   * Broadcast to admin users
   */
  public broadcastToAdmins(event: string, data: any): void {
    this.io?.to('admin').emit(event, data);
  }

  /**
   * Get online users count
   */
  public getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get online users
   */
  public getOnlineUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values()).filter(user => user.isOnline);
  }

  /**
   * Check if user is online
   */
  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  /**
   * Close WebSocket service
   */
  public close(): void {
    if (this.io) {
      this.io.close();
      this.io = null;
    }
    this.connectedUsers.clear();
    this.userSockets.clear();
    log.info('WebSocket service closed');
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
