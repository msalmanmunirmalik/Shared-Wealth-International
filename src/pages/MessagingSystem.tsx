import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
// import MessagingService from "@/integrations/postgresql/messagingService";
import { 
  MessageCircle, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Phone,
  Video,
  Mail,
  UserPlus,
  Archive,
  Trash2,
  Edit,
  Reply,
  Forward,
  Star,
  Pin,
  Attach,
  Smile,
  Paperclip,
  Mic,
  SendHorizontal,
  Check,
  CheckCheck,
  Clock,
  Users,
  Building,
  Globe,
  MapPin
} from "lucide-react";

interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'voice';
  attachments?: string[];
  isRead: boolean;
  isStarred: boolean;
  isPinned: boolean;
  replyToId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Conversation {
  id?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CompanyContact {
  id: string;
  name: string;
  sector: string;
  country: string;
  logo?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface NewMessage {
  receiverId: string;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'voice';
  attachments?: string[];
  replyToId?: string;
}

const MessagingSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<CompanyContact | null>(null);
  const [newMessage, setNewMessage] = useState<NewMessage>({
    receiverId: '',
    content: '',
    messageType: 'text',
    attachments: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadData();
      setupRealtimeSubscription();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      // Load company contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('network_companies')
        .select('id, name, sector, country, logo')
        .eq('status', 'active')
        .neq('user_id', user?.id);

      if (!contactsError && contactsData) {
        const contactsWithStatus: CompanyContact[] = contactsData.map(contact => ({
          ...contact,
          isOnline: Math.random() > 0.5, // Mock online status
          lastSeen: new Date(Date.now() - Math.random() * 86400000) // Mock last seen
        }));
        setContacts(contactsWithStatus);
      }

      // Load conversations
      if (user) {
        const { data: convsData, error: convsError } = await supabase
          .from('conversations')
          .select('*')
          .contains('participants', [user.id])
          .order('updated_at', { ascending: false });

        if (!convsError && convsData) {
          setConversations(convsData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
        updateConversation(newMessage);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  };

  const updateConversation = (message: Message) => {
    setConversations(prev => {
      const existing = prev.find(c => 
        c.participants.includes(message.senderId) && c.participants.includes(message.receiverId)
      );

      if (existing) {
        return prev.map(c => 
          c.id === existing.id 
            ? { ...c, lastMessage: message, unreadCount: c.unreadCount + 1, updatedAt: new Date() }
            : c
        );
      } else {
        // Create new conversation
        const newConversation: Conversation = {
          participants: [message.senderId, message.receiverId],
          lastMessage: message,
          unreadCount: 1,
          isPinned: false,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return [newConversation, ...prev];
      }
    });
  };

  const loadConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${conversation.participants.find(p => p !== user?.id)}),and(sender_id.eq.${conversation.participants.find(p => p !== user?.id)},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (!messagesError && messagesData) {
        setMessages(messagesData);
        
        // Mark messages as read
        const unreadMessages = messagesData.filter(m => 
          m.receiverId === user?.id && !m.isRead
        );
        
        if (unreadMessages.length > 0) {
          const messageIds = unreadMessages.map(m => m.id);
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', messageIds);
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !currentConversation || !newMessage.content.trim()) return;

    setIsSending(true);

    try {
      const receiverId = currentConversation.participants.find(p => p !== user.id);
      if (!receiverId) throw new Error('Receiver not found');

      const messageData = {
        sender_id: user.id,
        receiver_id: receiverId,
        content: newMessage.content,
        message_type: newMessage.messageType,
        attachments: newMessage.attachments || [],
        is_read: false,
        is_starred: false,
        is_pinned: false,
        reply_to_id: newMessage.replyToId,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      // Add message to local state
      const sentMessage: Message = {
        ...data,
        senderId: data.sender_id,
        receiverId: data.receiver_id,
        isRead: data.is_read,
        isStarred: data.is_starred,
        isPinned: data.is_pinned,
        replyToId: data.reply_to_id,
        createdAt: new Date(data.created_at)
      };

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage({ ...newMessage, content: '', attachments: [] });

      // Update conversation
      updateConversation(sentMessage);

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Failed",
        description: error.message || "An error occurred while sending the message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const startNewConversation = async (contact: CompanyContact) => {
    try {
      const conversationData = {
        participants: [user?.id, contact.id],
        unread_count: 0,
        is_pinned: false,
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single();

      if (error) throw error;

      const newConversation: Conversation = {
        ...data,
        participants: data.participants,
        unreadCount: data.unread_count,
        isPinned: data.is_pinned,
        isArchived: data.is_archived,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      setShowNewMessageDialog(false);

      toast({
        title: "Conversation Started",
        description: `Started a new conversation with ${contact.name}`,
      });
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Failed to Start Conversation",
        description: error.message || "An error occurred while starting the conversation",
        variant: "destructive"
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConversations = conversations.filter(conversation => {
    if (conversation.isArchived) return false;
    if (searchTerm) {
      const contact = contacts.find(c => 
        conversation.participants.includes(c.id) && c.id !== user?.id
      );
      return contact && (
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'rgb(245, 158, 11)' }}></div>
          <p className="text-gray-600">Loading messaging system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <Button
              size="sm"
              onClick={() => setShowNewMessageDialog(true)}
              className="flex items-center gap-2"
              style={{ backgroundColor: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' }}
            >
              <Plus className="w-4 h-4" />
              New
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const contact = contacts.find(c => 
              conversation.participants.includes(c.id) && c.id !== user?.id
            );
            
            if (!contact) return null;

            return (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => loadConversation(conversation)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contact.logo} />
                    <AvatarFallback className="bg-gray-200">
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2" style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate">
                      {contact.sector} • {contact.country}
                    </p>
                    
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contacts.find(c => 
                      currentConversation.participants.includes(c.id) && c.id !== user?.id
                    )?.logo} />
                    <AvatarFallback className="bg-gray-200">
                      {contacts.find(c => 
                        currentConversation.participants.includes(c.id) && c.id !== user?.id
                      )?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {contacts.find(c => 
                        currentConversation.participants.includes(c.id) && c.id !== user?.id
                      )?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {contacts.find(c => 
                        currentConversation.participants.includes(c.id) && c.id !== user?.id
                      )?.sector} • {contacts.find(c => 
                        currentConversation.participants.includes(c.id) && c.id !== user?.id
                      )?.country}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                const sender = isOwnMessage ? user : contacts.find(c => c.id === message.senderId);

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {!isOwnMessage && (
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={sender?.logo} />
                            <AvatarFallback className="text-xs">
                              {sender?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">{sender?.name}</span>
                        </div>
                      )}
                      
                      <div
                        className={`p-3 rounded-lg ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        
                        <div className={`flex items-center justify-between mt-2 text-xs ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>
                            {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            }) : ''}
                          </span>
                          
                          {isOwnMessage && (
                            <span className="flex items-center gap-1">
                              {message.isRead ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Smile className="w-4 h-4" />
                </Button>
                
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    className="min-h-[40px] max-h-32 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                </div>
                
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={isSending || !newMessage.content.trim()}
                  style={{ backgroundColor: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' }}
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <SendHorizontal className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Messages</h2>
              <p className="text-gray-600 mb-6">
                Start a conversation with other companies in the network
              </p>
              <Button
                onClick={() => setShowNewMessageDialog(true)}
                className="flex items-center gap-2 mx-auto"
                style={{ backgroundColor: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' }}
              >
                <Plus className="w-4 h-4" />
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Message Dialog */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
            <DialogDescription>
              Choose a company to start messaging with
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => startNewConversation(contact)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contact.logo} />
                    <AvatarFallback className="bg-gray-200">
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">
                      {contact.sector} • {contact.country}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${contact.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagingSystem;
