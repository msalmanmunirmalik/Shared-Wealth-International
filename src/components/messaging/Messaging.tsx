import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { webSocketService } from '@/services/webSocketService';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  attachments?: string[];
  createdAt: string;
  isRead: boolean;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
}

interface MessagingProps {
  className?: string;
}

export const Messaging: React.FC<MessagingProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (user) {
      initializeMessaging();
    }
    return () => {
      webSocketService.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeMessaging = async () => {
    try {
      // Connect to WebSocket
      await webSocketService.connect();
      setIsConnected(true);

      // Set up event listeners
      webSocketService.onMessage((message: Message) => {
        setMessages(prev => [...prev, message]);
        markMessageAsRead(message.id);
      });

      webSocketService.onTyping((data: { userId: string; isTyping: boolean }) => {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
      });

      webSocketService.onUserOnline((data: { userId: string; isOnline: boolean }) => {
        setConversations(prev => prev.map(conv => 
          conv.participantId === data.userId 
            ? { ...conv, isOnline: data.isOnline }
            : conv
        ));
      });

      // Load conversations
      await loadConversations();
    } catch (error) {
      console.error('Failed to initialize messaging:', error);
      toast.error('Failed to connect to messaging service');
    }
  };

  const loadConversations = async () => {
    try {
      const response = await apiService.getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await apiService.getMessages(conversationId);
      if (response.success) {
        setMessages(response.data);
        markConversationAsRead(conversationId);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const response = await apiService.sendMessage({
        recipientId: selectedConversation,
        content: newMessage.trim(),
        messageType: 'text'
      });

      if (response.success) {
        setNewMessage('');
        // Message will be added via WebSocket listener
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await apiService.markMessageAsRead(messageId);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const markConversationAsRead = async (conversationId: string) => {
    try {
      await apiService.markConversationAsRead(conversationId);
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      ));
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    }
  };

  const handleTyping = () => {
    if (!selectedConversation || !user) return;

    setIsTyping(true);
    webSocketService.sendTyping(selectedConversation, true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      webSocketService.sendTyping(selectedConversation, false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={`flex h-[600px] border rounded-lg ${className}`}>
      {/* Conversations Sidebar */}
      <div className="w-80 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex items-center space-x-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                selectedConversation === conversation.participantId ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.participantId)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.participantAvatar} />
                    <AvatarFallback>
                      {getInitials(conversation.participantName.split(' ')[0], conversation.participantName.split(' ')[1] || '')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conversation.participantName}</p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={conversations.find(c => c.participantId === selectedConversation)?.participantAvatar} />
                    <AvatarFallback>
                      {getInitials(
                        conversations.find(c => c.participantId === selectedConversation)?.participantName.split(' ')[0] || '',
                        conversations.find(c => c.participantId === selectedConversation)?.participantName.split(' ')[1] || ''
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {conversations.find(c => c.participantId === selectedConversation)?.participantName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {conversations.find(c => c.participantId === selectedConversation)?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Block User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === user?.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-500">
                      {typingUsers.length === 1 ? 'Someone is typing...' : `${typingUsers.length} people are typing...`}
                    </p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
