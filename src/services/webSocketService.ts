import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

// Use environment variable for API URL, fallback based on domain
// For production domains, use the same domain (avoid CORS issues)
const getWebSocketUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Production domains - use same domain to avoid CORS
  if (hostname === 'sharedwealth.net' || 
      hostname === 'www.sharedwealth.net' || 
      hostname.includes('onrender.com')) {
    return `${protocol}//${hostname}`;
  }
  
  // Development - use localhost
  return 'http://localhost:8080';
};

const API_BASE_URL = getWebSocketUrl();

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

export interface SocketUser {
  userId: string;
  userRole: string;
  userEmail: string;
  socketId: string;
  isOnline: boolean;
  lastSeen: Date;
  currentRoom?: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  /**
   * Connect to WebSocket server
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(API_BASE_URL, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        console.log('🔌 WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        this.isConnected = false;
        this.handleReconnect();
      });

      this.setupEventHandlers();
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket disconnected');
    }
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('pong', () => {
      console.log('🏓 Pong received');
    });

    // Message events
    this.socket.on('new_message', (data: MessageData) => {
      this.emit('new_message', data);
    });

    this.socket.on('message_sent', (data: MessageData) => {
      this.emit('message_sent', data);
    });

    this.socket.on('message_read', (data: { messageId: string; readAt: Date }) => {
      this.emit('message_read', data);
    });

    this.socket.on('message_error', (data: { error: string }) => {
      this.emit('message_error', data);
    });

    // Typing events
    this.socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      this.emit('user_typing', data);
    });

    // Notification events
    this.socket.on('new_notification', (data: NotificationData) => {
      this.emit('new_notification', data);
    });

    this.socket.on('unread_notifications', (data: NotificationData[]) => {
      this.emit('unread_notifications', data);
    });

    // Activity events
    this.socket.on('new_activity', (data: ActivityData) => {
      this.emit('new_activity', data);
    });

    // User status events
    this.socket.on('user_status', (data: { userId: string; isOnline: boolean; lastSeen: Date }) => {
      this.emit('user_status', data);
    });

    this.socket.on('online_users', (data: SocketUser[]) => {
      this.emit('online_users', data);
    });

    // Error events
    this.socket.on('error', (data: { message: string }) => {
      this.emit('error', data);
    });
  }

  /**
   * Handle reconnection
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
      }
    }, delay);
  }

  /**
   * Send message
   */
  sendMessage(data: Omit<MessageData, 'id' | 'createdAt'>): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('send_message', data);
  }

  /**
   * Join room
   */
  joinRoom(roomId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('join_room', roomId);
  }

  /**
   * Leave room
   */
  leaveRoom(roomId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('leave_room', roomId);
  }

  /**
   * Start typing indicator
   */
  startTyping(recipientId: string): void {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('typing_start', { recipientId });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(recipientId: string): void {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('typing_stop', { recipientId });
  }

  /**
   * Mark message as read
   */
  markMessageRead(messageId: string): void {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('mark_message_read', { messageId });
  }

  /**
   * Send notification (admin only)
   */
  sendNotification(data: Omit<NotificationData, 'id' | 'createdAt'>): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('send_notification', data);
  }

  /**
   * Update activity
   */
  updateActivity(data: Omit<ActivityData, 'id' | 'createdAt'>): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('update_activity', data);
  }

  /**
   * Get online users
   */
  getOnlineUsers(): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.socket.emit('get_online_users');
  }

  /**
   * Ping server
   */
  ping(): void {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('ping');
  }

  /**
   * Check if connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Get connection state
   */
  getConnectionState(): string {
    if (!this.socket) return 'disconnected';
    return this.socket.connected ? 'connected' : 'disconnected';
  }

  /**
   * Event emitter functionality
   */
  private eventListeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.eventListeners.clear();
    this.disconnect();
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// React hook for WebSocket
export const useWebSocket = () => {
  const { user, session } = useAuth();

  const connect = async () => {
    if (user && session) {
      const token = session.access_token || session.session?.access_token;
      if (token) {
        try {
          await webSocketService.connect(token);
        } catch (error) {
          console.error('Failed to connect to WebSocket:', error);
        }
      }
    }
  };

  const disconnect = () => {
    webSocketService.disconnect();
  };

  return {
    connect,
    disconnect,
    isConnected: webSocketService.isSocketConnected(),
    connectionState: webSocketService.getConnectionState(),
    webSocketService
  };
};

export default webSocketService;
