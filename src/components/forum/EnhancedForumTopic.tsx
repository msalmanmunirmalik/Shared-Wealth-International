import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, User, Eye, Reply } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReactionButton } from '@/components/social/ReactionButton';
import { FollowButton } from '@/components/social/FollowButton';
import { ShareButton } from '@/components/social/ShareButton';
import { FileUpload } from '@/components/files/FileUpload';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

interface ForumTopicProps {
  topic: ForumTopic;
  onReply?: () => void;
  className?: string;
}

export const EnhancedForumTopic: React.FC<ForumTopicProps> = ({
  topic,
  onReply,
  className = ''
}) => {
  const { user } = useAuth();
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [reactionStats, setReactionStats] = useState<any>(null);
  const [shareStats, setShareStats] = useState<any>(null);

  useEffect(() => {
    loadSocialStats();
  }, [topic.id]);

  const loadSocialStats = async () => {
    try {
      const [reactionsResponse, sharesResponse] = await Promise.all([
        apiService.getReactionStats(topic.id, 'forum_topic', user?.id),
        apiService.getShareStats(topic.id, 'forum_topic', user?.id)
      ]);

      if (reactionsResponse.success) {
        setReactionStats(reactionsResponse.data);
      }

      if (sharesResponse.success) {
        setShareStats(sharesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load social stats:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {topic.isPinned && (
                <Badge variant="default" className="bg-blue-500">
                  Pinned
                </Badge>
              )}
              {topic.isLocked && (
                <Badge variant="secondary">
                  Locked
                </Badge>
              )}
              {topic.category && (
                <Badge 
                  variant="outline" 
                  style={{ borderColor: topic.category.color, color: topic.category.color }}
                >
                  {topic.category.name}
                </Badge>
              )}
            </div>
            
            <h2 className="text-xl font-semibold mb-2">{topic.title}</h2>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatTimeAgo(topic.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{topic.viewCount} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Reply className="h-4 w-4" />
                <span>{topic.replyCount} replies</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ReactionButton
              postId={topic.id}
              postType="forum_topic"
              onReactionChange={() => loadSocialStats()}
            />
            <ShareButton
              contentId={topic.id}
              contentType="forum_topic"
              contentTitle={topic.title}
              onShare={() => loadSocialStats()}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={topic.author?.avatarUrl} />
            <AvatarFallback>
              {topic.author ? getInitials(topic.author.firstName, topic.author.lastName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-medium">
                {topic.author ? `${topic.author.firstName} ${topic.author.lastName}` : 'Unknown Author'}
              </p>
              <FollowButton
                targetUserId={topic.authorId}
                targetUserName={topic.author ? `${topic.author.firstName} ${topic.author.lastName}` : 'Unknown User'}
                className="text-sm"
              />
            </div>
            <p className="text-sm text-gray-500">
              {formatTimeAgo(topic.createdAt)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{topic.content}</p>
        </div>

        {/* Social Stats */}
        {(reactionStats || shareStats) && (
          <div className="flex items-center space-x-6 p-3 bg-gray-50 rounded-lg">
            {reactionStats && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Reactions:</span>
                <span className="text-sm text-gray-600">{reactionStats.totalReactions}</span>
              </div>
            )}
            {shareStats && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Shares:</span>
                <span className="text-sm text-gray-600">{shareStats.totalShares}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReply}
              disabled={topic.isLocked}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileUpload(!showFileUpload)}
            >
              <User className="h-4 w-4 mr-2" />
              Attach Files
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated {formatTimeAgo(topic.updatedAt)}
          </div>
        </div>

        {/* File Upload */}
        {showFileUpload && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Attach Files to Topic</h4>
            <FileUpload
              entityType="forum_topic"
              entityId={topic.id}
              maxFiles={3}
              maxSize={5}
              acceptedTypes={['image/*', 'application/pdf', 'text/*']}
              onUploadComplete={(files) => {
                console.log('Files uploaded:', files);
                setShowFileUpload(false);
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
