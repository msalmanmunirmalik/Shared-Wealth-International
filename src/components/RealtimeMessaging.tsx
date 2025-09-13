import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWebSocket } from "@/services/webSocketService";
import { apiService } from "@/services/api";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Users,
  Wifi,
  WifiOff,
  Loader2
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'voice' | 'system';
  attachments?: string[];
  replyToId?: string;
  isRead: boolean;
  createdAt: Date;
  sender?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Conversation {
  otherUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  lastMessage: string;
  lastMessageAt: string;
  isRead: boolean;
  isSentByMe: boolean;
  status: 'sent' | 'unread' | 'read';
}

interface OnlineUser {
  userId: string;
  userEmail: string;
  userRole: string;
  lastSeen: Date;
}

const RealtimeMessaging: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { connect, disconnect, isConnected, connectionState } = useWebSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      initializeMessaging();
    }

    return () => {
      disconnect();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeMessaging = async () => {
    try {
      setIsLoading(true);
      
      // Connect to WebSocket
      await connect();
      
      // Load conversations
      await loadConversations();
      
      // Setup WebSocket event listeners
      setupWebSocketListeners();
      
    } catch (error) {
      console.error('Failed to initialize messaging:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to real-time messaging',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocketListeners = () => {
    const { webSocketService } = useWebSocket();

    // New message received
    webSocketService.on('new_message', (data: Message) => {
      setMessages(prev => [...prev, data]);
      updateConversation(data);
      
      // Show notification if not in current conversation
      if (selectedConversation?.otherUserId !== data.senderId) {
        toast({
          title: 'New Message',
          description: data.content.substring(0, 50) + (data.content.length > 50 ? '...' : ''),
        });
      }
    });

    // Message sent confirmation
    webSocketService.on('message_sent', (data: Message) => {
      setMessages(prev => [...prev, data]);
    });

    // Message read confirmation
    webSocketService.on('message_read', (data: { messageId: string; readAt: Date }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, isRead: true }
            : msg
        )
      );
    });

    // Typing indicators
    webSocketService.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    // Online users
    webSocketService.on('online_users', (data: OnlineUser[]) => {
      setOnlineUsers(data);
    });

    // User status updates
    webSocketService.on('user_status', (data: { userId: string; isOnline: boolean; lastSeen: Date }) => {
      // Update online users list
      setOnlineUsers(prev => 
        prev.map(user => 
          user.userId === data.userId 
            ? { ...user, lastSeen: data.lastSeen }
            : user
        )
      );
    });
  };

  const loadConversations = async () => {
    try {
      const response = await apiService.getConversations();
      setConversations(response);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await apiService.getMessages(userId);
      setMessages(response);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    try {
      setIsSending(true);
      
      const { webSocketService } = useWebSocket();
      
      webSocketService.sendMessage({
        recipientId: selectedConversation.otherUserId,
        content: newMessage.trim(),
        messageType: 'text'
      });

      setNewMessage('');
      
      // Stop typing indicator
      webSocketService.stopTyping(selectedConversation.otherUserId);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Send Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    if (!selectedConversation) return;

    const { webSocketService } = useWebSocket();
    
    // Start typing indicator
    webSocketService.startTyping(selectedConversation.otherUserId);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      webSocketService.stopTyping(selectedConversation.otherUserId);
    }, 2000);
  };

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.otherUserId);
    
    // Mark messages as read
    const unreadMessages = messages.filter(msg => 
      msg.senderId === conversation.otherUserId && !msg.isRead
    );
    
    for (const message of unreadMessages) {
      const { webSocketService } = useWebSocket();
      webSocketService.markMessageRead(message.id);
    }
  };

  const updateConversation = (message: Message) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.otherUserId === message.senderId || conv.otherUserId === message.recipientId
          ? {
              ...conv,
              lastMessage: message.content,
              lastMessageAt: message.createdAt.toISOString(),
              isRead: message.senderId === user?.id ? true : conv.isRead,
              status: message.senderId === user?.id ? 'sent' : 'unread'
            }
          : conv
      )
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatus = (message: Message) => {
    if (message.senderId !== user?.id) return null;
    
    if (message.isRead) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    } else {
      return <Check className="w-4 h-4 text-gray-400" />;
    }
  };

  const getConnectionStatus = () => {
    switch (connectionState) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Connecting to real-time messaging...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex items-center gap-2">
              {getConnectionStatus()}
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {connectionState}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{onlineUsers.length} online</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.otherUserId}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation?.otherUserId === conversation.otherUserId
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => selectConversation(conversation)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {conversation.firstName.charAt(0)}{conversation.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.firstName} {conversation.lastName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      {!conversation.isRead && conversation.status === 'unread' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {selectedConversation.firstName.charAt(0)}{selectedConversation.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold">
                      {selectedConversation.firstName} {selectedConversation.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedConversation.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {typingUsers.has(selectedConversation.otherUserId) && (
                    <Badge variant="outline" className="text-blue-600">
                      Typing...
                    </Badge>
                  )}
                  
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">
                            {formatTime(message.createdAt)}
                          </span>
                          {getMessageStatus(message)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {typingUsers.has(selectedConversation.otherUserId) && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-2">
                <Textarea
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="min-h-[40px] max-h-32 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="sm"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeMessaging;
