import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { log } from '../middleware/logger.js';
class WebSocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map();
        this.userSockets = new Map();
    }
    initialize(httpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3001",
                methods: ["GET", "POST"],
                credentials: true
            },
            transports: ['websocket', 'polling']
        });
        this.setupMiddleware();
        this.setupEventHandlers();
        log.info('WebSocket service initialized successfully');
    }
    setupMiddleware() {
        if (!this.io)
            return;
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    return next(new Error('Authentication token required'));
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
                const user = await DatabaseService.findById('users', decoded.userId);
                if (!user) {
                    return next(new Error('User not found'));
                }
                socket.userId = decoded.userId;
                socket.userRole = decoded.role;
                socket.userEmail = decoded.email;
                next();
            }
            catch (error) {
                log.error('WebSocket authentication error', { error: error instanceof Error ? error.message : error });
                next(new Error('Invalid authentication token'));
            }
        });
    }
    setupEventHandlers() {
        if (!this.io)
            return;
        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });
    }
    handleConnection(socket) {
        if (!socket.userId)
            return;
        const user = {
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
        socket.join(`user:${socket.userId}`);
        if (socket.userRole === 'admin' || socket.userRole === 'superadmin') {
            socket.join('admin');
        }
        this.broadcastUserStatus(socket.userId, true);
        this.sendUnreadNotifications(socket);
        this.setupSocketEventHandlers(socket);
        socket.on('disconnect', () => {
            this.handleDisconnection(socket);
        });
    }
    setupSocketEventHandlers(socket) {
        if (!socket.userId)
            return;
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            const user = this.connectedUsers.get(socket.id);
            if (user) {
                user.currentRoom = roomId;
            }
            log.info('User joined room', { userId: socket.userId, roomId });
        });
        socket.on('leave_room', (roomId) => {
            socket.leave(roomId);
            const user = this.connectedUsers.get(socket.id);
            if (user) {
                user.currentRoom = undefined;
            }
            log.info('User left room', { userId: socket.userId, roomId });
        });
        socket.on('send_message', async (data) => {
            await this.handleSendMessage(socket, data);
        });
        socket.on('typing_start', (data) => {
            this.handleTypingStart(socket, data.recipientId);
        });
        socket.on('typing_stop', (data) => {
            this.handleTypingStop(socket, data.recipientId);
        });
        socket.on('mark_message_read', async (data) => {
            await this.handleMarkMessageRead(socket, data.messageId);
        });
        socket.on('send_notification', async (data) => {
            await this.handleSendNotification(socket, data);
        });
        socket.on('update_activity', async (data) => {
            await this.handleUpdateActivity(socket, data);
        });
        socket.on('get_online_users', () => {
            this.handleGetOnlineUsers(socket);
        });
        socket.on('ping', () => {
            socket.emit('pong');
        });
    }
    handleDisconnection(socket) {
        if (!socket.userId)
            return;
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
        this.broadcastUserStatus(socket.userId, false);
    }
    async handleSendMessage(socket, data) {
        try {
            if (!socket.userId)
                return;
            const messageRecord = await DatabaseService.insert('messages', {
                sender_id: socket.userId,
                recipient_id: data.recipientId,
                content: data.content,
                message_type: data.messageType || 'message',
                is_read: false
            });
            const messageData = {
                id: messageRecord.id,
                senderId: socket.userId,
                recipientId: data.recipientId,
                content: data.content,
                messageType: data.messageType || 'text',
                attachments: data.attachments,
                replyToId: data.replyToId,
                createdAt: new Date()
            };
            const recipientSocketId = this.userSockets.get(data.recipientId);
            if (recipientSocketId) {
                this.io?.to(recipientSocketId).emit('new_message', messageData);
            }
            socket.emit('message_sent', messageData);
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
        }
        catch (error) {
            log.error('Error sending message', { error: error instanceof Error ? error.message : error });
            socket.emit('message_error', { error: 'Failed to send message' });
        }
    }
    handleTypingStart(socket, recipientId) {
        const recipientSocketId = this.userSockets.get(recipientId);
        if (recipientSocketId) {
            this.io?.to(recipientSocketId).emit('user_typing', {
                userId: socket.userId,
                isTyping: true
            });
        }
    }
    handleTypingStop(socket, recipientId) {
        const recipientSocketId = this.userSockets.get(recipientId);
        if (recipientSocketId) {
            this.io?.to(recipientSocketId).emit('user_typing', {
                userId: socket.userId,
                isTyping: false
            });
        }
    }
    async handleMarkMessageRead(socket, messageId) {
        try {
            await DatabaseService.update('messages', messageId, {
                is_read: true,
                read_at: new Date()
            });
            socket.emit('message_read', { messageId });
        }
        catch (error) {
            log.error('Error marking message as read', { error: error instanceof Error ? error.message : error });
        }
    }
    async handleSendNotification(socket, data) {
        try {
            if (!socket.userId)
                return;
            if (socket.userRole !== 'admin' && socket.userRole !== 'superadmin') {
                socket.emit('error', { message: 'Unauthorized to send notifications' });
                return;
            }
            await this.createNotification(data);
            if (data.userId) {
                const userSocketId = this.userSockets.get(data.userId);
                if (userSocketId) {
                    this.io?.to(userSocketId).emit('new_notification', data);
                }
            }
            else {
                this.io?.emit('new_notification', data);
            }
            log.info('Notification sent', { type: data.type, userId: data.userId });
        }
        catch (error) {
            log.error('Error sending notification', { error: error instanceof Error ? error.message : error });
        }
    }
    async handleUpdateActivity(socket, data) {
        try {
            if (!socket.userId)
                return;
            const activityRecord = await DatabaseService.insert('activity_feed', {
                user_id: socket.userId,
                activity_type: data.activityType,
                activity_data: data.activityData,
                is_read: false
            });
            this.broadcastActivity(socket.userId, {
                id: activityRecord.id,
                userId: socket.userId,
                activityType: data.activityType,
                activityData: data.activityData,
                createdAt: new Date()
            });
            log.info('Activity updated', { userId: socket.userId, activityType: data.activityType });
        }
        catch (error) {
            log.error('Error updating activity', { error: error instanceof Error ? error.message : error });
        }
    }
    handleGetOnlineUsers(socket) {
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
    async sendUnreadNotifications(socket) {
        try {
            if (!socket.userId)
                return;
            const notifications = await DatabaseService.findAll('activity_feed', {
                where: { user_id: socket.userId, is_read: false }
            });
            socket.emit('unread_notifications', notifications);
        }
        catch (error) {
            log.error('Error fetching unread notifications', { error: error instanceof Error ? error.message : error });
        }
    }
    broadcastUserStatus(userId, isOnline) {
        const userSocketId = this.userSockets.get(userId);
        if (userSocketId) {
            this.io?.to(`user:${userId}`).emit('user_status', {
                userId,
                isOnline,
                lastSeen: new Date()
            });
        }
    }
    broadcastActivity(userId, activity) {
        this.io?.to(`user:${userId}`).emit('new_activity', activity);
    }
    async createNotification(data) {
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
    sendToUser(userId, event, data) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.io?.to(socketId).emit(event, data);
        }
    }
    sendToRoom(roomId, event, data) {
        this.io?.to(roomId).emit(event, data);
    }
    broadcast(event, data) {
        this.io?.emit(event, data);
    }
    broadcastToAdmins(event, data) {
        this.io?.to('admin').emit(event, data);
    }
    getOnlineUsersCount() {
        return this.connectedUsers.size;
    }
    getOnlineUsers() {
        return Array.from(this.connectedUsers.values()).filter(user => user.isOnline);
    }
    isUserOnline(userId) {
        return this.userSockets.has(userId);
    }
    close() {
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
//# sourceMappingURL=webSocketService.js.map