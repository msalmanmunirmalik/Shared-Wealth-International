import { Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
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
declare class WebSocketService {
    private io;
    private connectedUsers;
    private userSockets;
    initialize(httpServer: HTTPServer): void;
    private setupMiddleware;
    private setupEventHandlers;
    private handleConnection;
    private setupSocketEventHandlers;
    private handleDisconnection;
    private handleSendMessage;
    private handleTypingStart;
    private handleTypingStop;
    private handleMarkMessageRead;
    private handleSendNotification;
    private handleUpdateActivity;
    private handleGetOnlineUsers;
    private sendUnreadNotifications;
    private broadcastUserStatus;
    private broadcastActivity;
    private createNotification;
    sendToUser(userId: string, event: string, data: any): void;
    sendToRoom(roomId: string, event: string, data: any): void;
    broadcast(event: string, data: any): void;
    broadcastToAdmins(event: string, data: any): void;
    getOnlineUsersCount(): number;
    getOnlineUsers(): SocketUser[];
    isUserOnline(userId: string): boolean;
    close(): void;
}
export declare const webSocketService: WebSocketService;
export default webSocketService;
//# sourceMappingURL=webSocketService.d.ts.map