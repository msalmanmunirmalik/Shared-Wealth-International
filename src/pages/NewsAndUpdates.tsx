import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { ReactionButton } from "@/components/social/ReactionButton";
import { ShareButton } from "@/components/social/ShareButton";
import { FileUpload } from "@/components/files/FileUpload";
import {
  Calendar,
  User,
  Building2,
  Heart,
  Share2,
  MessageCircle,
  TrendingUp,
  Filter,
  Search,
  Globe,
  Users,
  Award,
  Zap,
  Plus,
  ThumbsUp,
  Bookmark,
  Clock,
  Star,
  Edit,
  X,
  Lock,
  Unlock,
  File,
  Eye
} from "lucide-react";

interface NewsPost {
  id: string;
  company_id?: string;
  author_id: string;
  title: string;
  content: string;
  post_type: 'news' | 'stories' | 'discussions' | 'announcement';
  tags: string[];
  media_urls: string[];
  reactions: Record<string, number>;
  comments_count: number;
  shares_count: number;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  company_name?: string;
  company_logo?: string;
  company_sector?: string;
  first_name: string;
  last_name: string;
  author_email: string;
}

const NewsAndUpdates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddPost, setShowAddPost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  
  // Form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'news' as const,
    tags: [] as string[],
    media_urls: [] as string[]
  });
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalReactions: 0,
    totalShares: 0,
    totalComments: 0
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllContent({
        is_published: true,
        limit: 50,
        offset: 0,
        sort_by: 'published_at',
        sort_order: 'desc'
      });
      
      if (response.success) {
        setNews(response.data);
        calculateStats(response.data);
      } else {
        // Fallback to sample data
        loadSampleNews();
      }
    } catch (error) {
      console.error('Error loading news:', error);
      loadSampleNews();
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleNews = () => {
    const sampleNews: NewsPost[] = [
      {
        id: "1",
        company_id: "comp-1",
        author_id: "user-1",
        title: "Shared Wealth Network Launches New Partnership Program",
        content: "We're excited to announce our new partnership program that will help companies collaborate more effectively on sustainable business practices. This initiative focuses on creating meaningful connections between organizations committed to shared wealth principles.",
        post_type: "announcement",
        tags: ["partnership", "sustainability", "collaboration"],
        media_urls: [],
        reactions: { like: 45, love: 12, share: 8 },
        comments_count: 23,
        shares_count: 15,
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company_name: "Shared Wealth International",
        company_logo: "/placeholder.svg",
        company_sector: "Technology",
        first_name: "John",
        last_name: "Smith",
        author_email: "john@sharedwealth.com"
      },
      {
        id: "2",
        company_id: "comp-2",
        author_id: "user-2",
        title: "ESG Reporting Best Practices for 2024",
        content: "As we move into 2024, here are the key ESG reporting practices that companies should adopt to meet evolving regulatory requirements and stakeholder expectations.",
        post_type: "news",
        tags: ["ESG", "reporting", "compliance"],
        media_urls: [],
        reactions: { like: 32, love: 8, share: 12 },
        comments_count: 18,
        shares_count: 9,
        is_published: true,
        published_at: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        company_name: "GreenTech Solutions",
        company_logo: "/placeholder.svg",
        company_sector: "Environmental",
        first_name: "Sarah",
        last_name: "Johnson",
        author_email: "sarah@greentech.com"
      },
      {
        id: "3",
        author_id: "user-3",
        title: "How to Build Sustainable Business Models",
        content: "In this story, we explore how companies can transition to sustainable business models that benefit all stakeholders while maintaining profitability.",
        post_type: "stories",
        tags: ["sustainability", "business-model", "innovation"],
        media_urls: [],
        reactions: { like: 28, love: 15, share: 6 },
        comments_count: 12,
        shares_count: 8,
        is_published: true,
        published_at: new Date(Date.now() - 172800000).toISOString(),
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        first_name: "Michael",
        last_name: "Chen",
        author_email: "michael@example.com"
      }
    ];
    
    setNews(sampleNews);
    calculateStats(sampleNews);
  };

  const calculateStats = (posts: NewsPost[]) => {
    const totalPosts = posts.length;
    const totalReactions = posts.reduce((sum, post) => 
      sum + Object.values(post.reactions).reduce((a, b) => a + b, 0), 0);
    const totalShares = posts.reduce((sum, post) => sum + post.shares_count, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments_count, 0);
    
    setStats({ totalPosts, totalReactions, totalShares, totalComments });
  };

  // File upload handlers
  const handleFileUploadComplete = (files: any[]) => {
    setUploadedFiles(files);
    const mediaUrls = files.map(file => file.publicUrl || file.url);
    setNewPost(prev => ({
      ...prev,
      media_urls: [...prev.media_urls, ...mediaUrls]
    }));
  };

  const handleFileUploadError = (error: string) => {
    toast({
      title: "Upload Error",
      description: error,
      variant: "destructive",
    });
  };

  const removeUploadedFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    const mediaUrls = newFiles.map(file => file.publicUrl || file.url);
    setNewPost(prev => ({
      ...prev,
      media_urls: mediaUrls
    }));
  };

  // CRUD handlers
  const handleAddPost = async () => {
    try {
      const response = await apiService.createContent({
        title: newPost.title,
        content: newPost.content,
        type: newPost.post_type,
        tags: newPost.tags,
        media_urls: newPost.media_urls,
        is_published: true
      });
      
      if (response.success) {
        await loadNews();
        setNewPost({
          title: '',
          content: '',
          post_type: 'news',
          tags: [],
          media_urls: []
        });
        setUploadedFiles([]);
        setShowAddPost(false);
        toast({
          title: "Success",
          description: "Post published successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create post',
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post: NewsPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      post_type: post.post_type,
      tags: post.tags,
      media_urls: post.media_urls || []
    });
    setUploadedFiles([]);
    setShowEditPost(true);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      const response = await apiService.updateContent(editingPost.id, {
        title: newPost.title,
        content: newPost.content,
        type: newPost.post_type,
        tags: newPost.tags,
        media_urls: newPost.media_urls,
        is_published: true
      });
      
      if (response.success) {
        await loadNews();
        setEditingPost(null);
        setShowEditPost(false);
        setNewPost({
          title: '',
          content: '',
          post_type: 'news',
          tags: [],
          media_urls: []
        });
        setUploadedFiles([]);
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update post',
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await apiService.deleteContent(postId);
      
      if (response.success) {
        await loadNews();
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete post',
        variant: "destructive",
      });
    }
  };

  const handleTogglePostPublishStatus = async (postId: string) => {
    try {
      const currentPost = news.find(post => post.id === postId);
      if (!currentPost) {
        throw new Error('Post not found');
      }
      
      const response = await apiService.toggleContentPublishStatus(postId, !currentPost.is_published);
      
      if (response.success) {
        await loadNews();
        toast({
          title: "Success",
          description: `Post ${!currentPost.is_published ? 'published' : 'unpublished'} successfully`,
        });
      } else {
        throw new Error(response.message || 'Failed to update post status');
      }
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update post status',
        variant: "destructive",
      });
    }
  };

  // Filter posts
  const filteredNews = news.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.post_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'news', label: 'News' },
    { value: 'stories', label: 'Stories' },
    { value: 'discussions', label: 'Discussions' },
    { value: 'announcement', label: 'Announcements' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">News & Updates</h1>
              <p className="text-lg text-gray-600">Stay informed with the latest from our community</p>
            </div>
            {user && (
              <Button onClick={() => setShowAddPost(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            )}
          </div>


          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <File className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Posts Found</h3>
                <p className="text-gray-600 mb-6">
                  {news.length === 0 
                    ? "No posts have been published yet"
                    : "Try adjusting your search or filters"
                  }
                </p>
                {user && news.length === 0 && (
                  <Button onClick={() => setShowAddPost(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredNews.map((post) => (
              <Card key={post.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.company_logo || "/placeholder.svg"} />
                        <AvatarFallback>
                          {post.company_name ? post.company_name.charAt(0) : post.first_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription>
                          {post.company_name && (
                            <span className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {post.company_name}
                            </span>
                          )}
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.first_name} {post.last_name}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {post.post_type}
                      </Badge>
                      <Badge variant={post.is_published ? 'default' : 'secondary'}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {user && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePostPublishStatus(post.id)}
                          >
                            {post.is_published ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{post.content}</p>
                  
                  {/* Display media files */}
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Attachments:</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {post.media_urls.map((mediaUrl, index) => (
                          <div key={index} className="relative group">
                            {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img
                                src={mediaUrl}
                                alt={`Media ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-full h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <File className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100"
                                onClick={() => window.open(mediaUrl, '_blank')}
                              >
                                <Eye className="w-4 h-4 text-white" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <ReactionButton
                        contentId={post.id}
                        contentType="post"
                        initialReactions={post.reactions}
                      />
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments_count}
                      </Button>
                      <ShareButton
                        contentId={post.id}
                        contentType="post"
                        title={post.title}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Post Dialog */}
        <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create News & Update</DialogTitle>
              <DialogDescription>
                Share news, stories, discussions, or announcements with the community.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-post-title">Title</Label>
                <Input
                  id="add-post-title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-post-type">Category</Label>
                <Select value={newPost.post_type} onValueChange={(value) => setNewPost({...newPost, post_type: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="stories">Stories</SelectItem>
                    <SelectItem value="discussions">Discussions</SelectItem>
                    <SelectItem value="announcement">Announcements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-post-content">Content</Label>
                <Textarea
                  id="add-post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Write your post content here..."
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-post-tags">Tags (comma-separated)</Label>
                <Input
                  id="add-post-tags"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)})}
                  placeholder="e.g., sustainability, innovation, partnership"
                />
              </div>
              
              {/* Media Upload Section */}
              <div className="space-y-2">
                <Label>Media Files</Label>
                <FileUpload
                  uploadType="image"
                  multiple={true}
                  maxFiles={5}
                  relatedEntityType="post"
                  onUploadComplete={handleFileUploadComplete}
                  onUploadError={handleFileUploadError}
                  className="w-full"
                />
                
                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Files:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-blue-600" />
                            <span className="text-sm truncate">{file.originalName}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadedFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddPost(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPost}>
                Create Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Post Dialog */}
        <Dialog open={showEditPost} onOpenChange={setShowEditPost}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit News & Update</DialogTitle>
              <DialogDescription>
                Update your post content and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-post-title">Title</Label>
                <Input
                  id="edit-post-title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-post-type">Category</Label>
                <Select value={newPost.post_type} onValueChange={(value) => setNewPost({...newPost, post_type: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="stories">Stories</SelectItem>
                    <SelectItem value="discussions">Discussions</SelectItem>
                    <SelectItem value="announcement">Announcements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-post-content">Content</Label>
                <Textarea
                  id="edit-post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Enter post content"
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-post-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-post-tags"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                  placeholder="Enter tags separated by commas"
                />
              </div>
              
              {/* Media Upload Section */}
              <div className="space-y-2">
                <Label>Media Files</Label>
                <FileUpload
                  uploadType="image"
                  multiple={true}
                  maxFiles={5}
                  relatedEntityType="post"
                  onUploadComplete={handleFileUploadComplete}
                  onUploadError={handleFileUploadError}
                  className="w-full"
                />
                
                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Files:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-blue-600" />
                            <span className="text-sm truncate">{file.originalName}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadedFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditPost(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePost}>
                Update Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default NewsAndUpdates;