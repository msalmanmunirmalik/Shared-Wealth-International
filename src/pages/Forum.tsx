import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ForumService from '@/integrations/postgresql/forumService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  ThumbsUp, 
  Reply, 
  Edit, 
  Save, 
  X,
  User,
  Calendar,
  Eye,
  TrendingUp,
  Bookmark,
  Share
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  author: {
    full_name: string;
    avatar_url: string | null;
  };
  image_url: string | null;
}

interface ForumReply {
  id: string;
  topic_id: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  is_solution: boolean;
  author: {
    full_name: string;
    avatar_url: string | null;
  };
}

const Forum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTopicDialog, setShowTopicDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Form states
  const [topicForm, setTopicForm] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const [replyForm, setReplyForm] = useState({
    content: ''
  });

  // Add image to topic form state
  const [topicImage, setTopicImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTopics();
    }
  }, [user]);

  const loadTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:profiles!forum_topics_author_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading topics:', error);
        return;
      }

      setTopics(data || []);
    } catch (error) {
      console.error('Topics load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReplies = async (topicId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select(`
          *,
          author:profiles!forum_replies_author_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading replies:', error);
        return;
      }

      setReplies(data || []);
    } catch (error) {
      console.error('Replies load error:', error);
    }
  };

  const handleCreateTopic = async () => {
    if (!user) return;

    setIsCreating(true);
    setError('');
    let imageUrl = null;

    try {
      // Upload image if present
      if (topicImage) {
        const fileExt = topicImage.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage.from('forum-images').upload(fileName, topicImage);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('forum-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
      const { error } = await supabase
        .from('forum_topics')
        .insert({
          title: topicForm.title,
          content: topicForm.content,
          category: topicForm.category,
          author_id: user.id,
          image_url: imageUrl
        });

      if (error) {
        console.error('Error creating topic:', error);
        setError('Failed to create topic');
        return;
      }

      toast({
        title: "Topic Created",
        description: "Your discussion topic has been created successfully.",
      });

      setShowCreateDialog(false);
      setTopicForm({ title: '', content: '', category: 'general' });
      setTopicImage(null);
      setImagePreview(null);
      await loadTopics();
    } catch (error) {
      console.error('Topic creation error:', error);
      setError('Failed to create topic');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateReply = async (topicId: string) => {
    if (!user) return;

    setIsReplying(true);
    setError('');

    try {
      const { error } = await supabase
        .from('forum_replies')
        .insert({
          topic_id: topicId,
          content: replyForm.content,
          author_id: user.id
        });

      if (error) {
        console.error('Error creating reply:', error);
        setError('Failed to create reply');
        return;
      }

      toast({
        title: "Reply Posted",
        description: "Your reply has been posted successfully.",
      });

      setReplyForm({ content: '' });
      await loadReplies(topicId);
    } catch (error) {
      console.error('Reply creation error:', error);
      setError('Failed to create reply');
    } finally {
      setIsReplying(false);
    }
  };

  const handleUpdateTopic = async (topicId: string) => {
    setIsEditing(null);
    setError('');

    try {
      const { error } = await supabase
        .from('forum_topics')
        .update({
          title: topicForm.title,
          content: topicForm.content,
          category: topicForm.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', topicId);

      if (error) {
        console.error('Error updating topic:', error);
        setError('Failed to update topic');
        return;
      }

      toast({
        title: "Topic Updated",
        description: "Your topic has been updated successfully.",
      });

      await loadTopics();
    } catch (error) {
      console.error('Topic update error:', error);
      setError('Failed to update topic');
    }
  };

  const startEditing = (topic: ForumTopic) => {
    setIsEditing(topic.id);
    setTopicForm({
      title: topic.title,
      content: topic.content,
      category: topic.category
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setTopicForm({ title: '', content: '', category: 'general' });
  };

  const openTopic = async (topic: ForumTopic) => {
    setSelectedTopic(topic);
    setShowTopicDialog(true);
    await loadReplies(topic.id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'business': return 'bg-blue-100 text-blue-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'sustainability': return 'bg-green-100 text-green-800';
      case 'events': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || topic.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Discussion Forum</h1>
            <p className="text-muted-foreground">Connect, share ideas, and collaborate with the Shared Wealth community</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Discussion Topic</DialogTitle>
                <DialogDescription>
                  Start a conversation with the Shared Wealth community.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-title">Topic Title</Label>
                  <Input
                    id="topic-title"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                    placeholder="Enter your topic title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-category">Category</Label>
                  <select
                    id="topic-category"
                    value={topicForm.category}
                    onChange={(e) => setTopicForm({ ...topicForm, category: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="general">General Discussion</option>
                    <option value="business">Business & Strategy</option>
                    <option value="technology">Technology</option>
                    <option value="sustainability">Sustainability</option>
                    <option value="events">Events & Networking</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-content">Content</Label>
                  <Textarea
                    id="topic-content"
                    value={topicForm.content}
                    onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                    placeholder="Share your thoughts, questions, or ideas..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-image">Image (optional)</Label>
                  <Input
                    id="topic-image"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      setTopicImage(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="max-h-40 mt-2 rounded" />
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTopic} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Topic'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="general">General Discussion</option>
            <option value="business">Business & Strategy</option>
            <option value="technology">Technology</option>
            <option value="sustainability">Sustainability</option>
            <option value="events">Events & Networking</option>
          </select>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            <TabsTrigger value="my-topics">My Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-6">
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onOpen={() => openTopic(topic)}
                  onEdit={() => startEditing(topic)}
                  isEditing={isEditing === topic.id}
                  topicForm={topicForm}
                  setTopicForm={setTopicForm}
                  onSave={() => handleUpdateTopic(topic.id)}
                  onCancel={cancelEditing}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="space-y-4">
              {filteredTopics
                .sort((a, b) => (b.reply_count + b.view_count) - (a.reply_count + a.view_count))
                .map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onOpen={() => openTopic(topic)}
                    onEdit={() => startEditing(topic)}
                    isEditing={isEditing === topic.id}
                    topicForm={topicForm}
                    setTopicForm={setTopicForm}
                    onSave={() => handleUpdateTopic(topic.id)}
                    onCancel={cancelEditing}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="unanswered" className="space-y-6">
            <div className="space-y-4">
              {filteredTopics
                .filter(topic => topic.reply_count === 0)
                .map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onOpen={() => openTopic(topic)}
                    onEdit={() => startEditing(topic)}
                    isEditing={isEditing === topic.id}
                    topicForm={topicForm}
                    setTopicForm={setTopicForm}
                    onSave={() => handleUpdateTopic(topic.id)}
                    onCancel={cancelEditing}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="my-topics" className="space-y-6">
            <div className="space-y-4">
              {filteredTopics
                .filter(topic => topic.author_id === user?.id)
                .map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onOpen={() => openTopic(topic)}
                    onEdit={() => startEditing(topic)}
                    isEditing={isEditing === topic.id}
                    topicForm={topicForm}
                    setTopicForm={setTopicForm}
                    onSave={() => handleUpdateTopic(topic.id)}
                    onCancel={cancelEditing}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Topic Dialog */}
        <Dialog open={showTopicDialog} onOpenChange={setShowTopicDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedTopic && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTopic.title}</DialogTitle>
                  <DialogDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{selectedTopic.author.full_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedTopic.created_at).toLocaleDateString()}</span>
                      </div>
                      <Badge className={getCategoryColor(selectedTopic.category)}>
                        {selectedTopic.category}
                      </Badge>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {selectedTopic?.image_url && (
                    <div className="mb-4">
                      <img src={selectedTopic.image_url} alt="Topic" className="max-h-80 rounded mx-auto" />
                    </div>
                  )}
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{selectedTopic.content}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Replies ({replies.length})</h3>
                    <div className="space-y-4">
                      {replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3 p-4 border rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={reply.author.avatar_url || ''} />
                            <AvatarFallback>{reply.author.full_name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-sm">{reply.author.full_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.created_at).toLocaleDateString()}
                              </span>
                              {reply.is_solution && (
                                <Badge className="bg-green-100 text-green-800">Solution</Badge>
                              )}
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Add Reply</h4>
                      <div className="space-y-2">
                        <Textarea
                          value={replyForm.content}
                          onChange={(e) => setReplyForm({ content: e.target.value })}
                          placeholder="Write your reply..."
                          rows={4}
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => handleCreateReply(selectedTopic.id)}
                            disabled={isReplying || !replyForm.content.trim()}
                          >
                            {isReplying ? 'Posting...' : 'Post Reply'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Topic Card Component
interface TopicCardProps {
  topic: ForumTopic;
  onOpen: () => void;
  onEdit: () => void;
  isEditing: boolean;
  topicForm: any;
  setTopicForm: (form: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TopicCard = ({ 
  topic, 
  onOpen, 
  onEdit, 
  isEditing, 
  topicForm, 
  setTopicForm, 
  onSave, 
  onCancel 
}: TopicCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'business': return 'bg-blue-100 text-blue-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'sustainability': return 'bg-green-100 text-green-800';
      case 'events': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onOpen}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`title-${topic.id}`}>Title</Label>
              <Input
                id={`title-${topic.id}`}
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`content-${topic.id}`}>Content</Label>
              <Textarea
                id={`content-${topic.id}`}
                value={topicForm.content}
                onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                rows={3}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={(e) => { e.stopPropagation(); onSave(); }}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onCancel(); }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getCategoryColor(topic.category)}>
                    {topic.category}
                  </Badge>
                  {topic.is_pinned && (
                    <Badge variant="secondary">Pinned</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-navy mb-2">{topic.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {topic.content}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{topic.author.full_name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(topic.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{topic.reply_count} replies</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{topic.view_count} views</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Forum; 