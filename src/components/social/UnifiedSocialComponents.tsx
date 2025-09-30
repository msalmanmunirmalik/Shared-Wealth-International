import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import {
  Heart,
  ThumbsUp,
  Laugh,
  Wow,
  Sad,
  Angry,
  PartyPopper,
  Share2,
  Bookmark,
  BookmarkCheck,
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  BarChart3
} from "lucide-react";

interface SocialEngagementProps {
  contentId: string;
  contentType: string;
  initialReactions?: Record<string, number>;
  initialShares?: number;
  initialBookmarked?: boolean;
  authorId?: string;
  className?: string;
}

interface ReactionData {
  count: number;
  users: string[];
}

export const UnifiedSocialEngagement: React.FC<SocialEngagementProps> = ({
  contentId,
  contentType,
  initialReactions = {},
  initialShares = 0,
  initialBookmarked = false,
  authorId,
  className = ""
}) => {
  const [reactions, setReactions] = useState<Record<string, ReactionData>>({});
  const [shares, setShares] = useState(initialShares);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReactions();
  }, [contentId, contentType]);

  const loadReactions = async () => {
    try {
      const response = await apiService.getReactions(contentId, contentType);
      if (response.success) {
        setReactions(response.data);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReaction = async (reactionType: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const isCurrentlyReacted = userReactions.has(reactionType);
      
      let response;
      if (isCurrentlyReacted) {
        response = await apiService.removeReaction(contentId, reactionType, contentType);
      } else {
        response = await apiService.addReaction(contentId, reactionType, contentType);
      }
      
      if (response.success) {
        // Update local state
        const newUserReactions = new Set(userReactions);
        if (isCurrentlyReacted) {
          newUserReactions.delete(reactionType);
        } else {
          newUserReactions.add(reactionType);
        }
        setUserReactions(newUserReactions);
        
        // Reload reactions to get updated counts
        await loadReactions();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update reaction",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      const response = await apiService.shareContent(contentId, 'internal', platform);
      if (response.success) {
        setShares(prev => prev + 1);
        toast({
          title: "Success",
          description: `Content shared on ${platform}`,
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to share content",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sharing content:', error);
      toast({
        title: "Error",
        description: "Failed to share content",
        variant: "destructive"
      });
    }
  };

  const handleBookmark = async () => {
    try {
      let response;
      if (bookmarked) {
        response = await apiService.removeBookmark(contentId);
      } else {
        response = await apiService.bookmarkContent(contentId, contentType);
      }
      
      if (response.success) {
        setBookmarked(!bookmarked);
        toast({
          title: "Success",
          description: bookmarked ? "Bookmark removed" : "Content bookmarked",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update bookmark",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  const reactionIcons = {
    like: ThumbsUp,
    love: Heart,
    laugh: Laugh,
    wow: Wow,
    sad: Sad,
    angry: Angry,
    celebrate: PartyPopper
  };

  const totalReactions = Object.values(reactions).reduce((sum, reaction) => sum + reaction.count, 0);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Reactions */}
      <div className="flex items-center space-x-2">
        {Object.entries(reactionIcons).map(([type, Icon]) => {
          const reaction = reactions[type];
          const count = reaction?.count || 0;
          const isReacted = userReactions.has(type);
          
          return (
            <Button
              key={type}
              variant={isReacted ? "default" : "ghost"}
              size="sm"
              onClick={() => handleReaction(type)}
              disabled={isLoading}
              className={`h-8 px-2 ${isReacted ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {count > 0 && <span className="text-xs">{count}</span>}
            </Button>
          );
        })}
        {totalReactions > 0 && (
          <Badge variant="secondary" className="text-xs">
            {totalReactions} reactions
          </Badge>
        )}
      </div>

      {/* Share */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('internal')}
        className="h-8 px-2 hover:bg-gray-100"
      >
        <Share2 className="w-4 h-4 mr-1" />
        {shares > 0 && <span className="text-xs">{shares}</span>}
      </Button>

      {/* Bookmark */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={`h-8 px-2 ${bookmarked ? 'text-blue-600' : 'hover:bg-gray-100'}`}
      >
        {bookmarked ? (
          <BookmarkCheck className="w-4 h-4" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing?: boolean;
  connectionType?: string;
  className?: string;
}

export const UnifiedFollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  initialFollowing = false,
  connectionType = 'follow',
  className = ""
}) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      let response;
      if (following) {
        response = await apiService.unfollowUser(targetUserId);
      } else {
        response = await apiService.followUser(targetUserId, connectionType);
      }
      
      if (response.success) {
        setFollowing(!following);
        toast({
          title: "Success",
          description: following ? "User unfollowed" : "User followed",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update follow status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error handling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={following ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
      className={className}
    >
      {following ? (
        <>
          <UserMinus className="w-4 h-4 mr-1" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-1" />
          Follow
        </>
      )}
    </Button>
  );
};

interface SocialStatsProps {
  userId: string;
  className?: string;
}

export const UnifiedSocialStats: React.FC<SocialStatsProps> = ({
  userId,
  className = ""
}) => {
  const [stats, setStats] = useState({
    following_count: 0,
    followers_count: 0,
    total_reactions_given: 0,
    total_shares: 0,
    total_bookmarks: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const [connectionStats, analyticsStats] = await Promise.all([
        apiService.getConnectionStats(userId),
        apiService.getSocialAnalytics(userId, '30d')
      ]);
      
      if (connectionStats.success && analyticsStats.success) {
        setStats({
          ...connectionStats.data,
          ...analyticsStats.data
        });
      }
    } catch (error) {
      console.error('Error loading social stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center space-x-1">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{stats.followers_count} followers</span>
      </div>
      <div className="flex items-center space-x-1">
        <UserPlus className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{stats.following_count} following</span>
      </div>
      <div className="flex items-center space-x-1">
        <Heart className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{stats.total_reactions_given} reactions</span>
      </div>
      <div className="flex items-center space-x-1">
        <Share2 className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{stats.total_shares} shares</span>
      </div>
      <div className="flex items-center space-x-1">
        <Bookmark className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{stats.total_bookmarks} bookmarks</span>
      </div>
    </div>
  );
};

interface SocialFeedProps {
  limit?: number;
  className?: string;
}

export const UnifiedSocialFeed: React.FC<SocialFeedProps> = ({
  limit = 20,
  className = ""
}) => {
  const [feed, setFeed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getSocialFeed({ limit, offset });
      if (response.success) {
        setFeed(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load social feed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading social feed:', error);
      toast({
        title: "Error",
        description: "Failed to load social feed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const newOffset = offset + limit;
      const response = await apiService.getSocialFeed({ limit, offset: newOffset });
      if (response.success) {
        setFeed(prev => [...prev, ...response.data]);
        setOffset(newOffset);
      }
    } catch (error) {
      console.error('Error loading more feed:', error);
    }
  };

  if (isLoading && feed.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {feed.map((item) => (
        <div key={item.id} className="bg-white rounded-lg border p-4">
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {item.author_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.author_name}</h3>
              <p className="text-sm text-gray-500">
                {item.company_name && `${item.company_name} • `}
                {new Date(item.published_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h2>
          <p className="text-gray-700 mb-4">{item.content}</p>
          
          <UnifiedSocialEngagement
            contentId={item.id}
            contentType="unified_content"
            initialReactions={item.reactions}
            initialShares={item.shares_count}
            authorId={item.author_id}
          />
        </div>
      ))}
      
      {feed.length > 0 && (
        <Button
          variant="outline"
          onClick={loadMore}
          className="w-full"
        >
          Load More
        </Button>
      )}
    </div>
  );
};
