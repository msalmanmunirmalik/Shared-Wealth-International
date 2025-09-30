import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp, ThumbsDown, Laugh, Zap, Frown, Angry } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ReactionButtonProps {
  postId: string;
  postType: string;
  onReactionChange?: (reactionType: string | null) => void;
  className?: string;
}

interface ReactionStats {
  totalReactions: number;
  reactionBreakdown: {
    like: number;
    dislike: number;
    love: number;
    laugh: number;
    wow: number;
    sad: number;
    angry: number;
  };
  userReaction?: string;
}

const reactionTypes = [
  { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
  { type: 'love', icon: Heart, label: 'Love', color: 'text-red-500' },
  { type: 'laugh', icon: Laugh, label: 'Laugh', color: 'text-yellow-500' },
  { type: 'wow', icon: Zap, label: 'Wow', color: 'text-purple-500' },
  { type: 'sad', icon: Frown, label: 'Sad', color: 'text-gray-500' },
  { type: 'angry', icon: Angry, label: 'Angry', color: 'text-orange-500' },
  { type: 'dislike', icon: ThumbsDown, label: 'Dislike', color: 'text-gray-400' },
];

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  postId,
  postType,
  onReactionChange,
  className = ''
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReactionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadReactionStats();
  }, [postId, postType]);

  const loadReactionStats = async () => {
    try {
      const response = await apiService.getReactionStats(postId, postType, user?.id);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load reaction stats:', error);
    }
  };

  const handleReaction = async (reactionType: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (stats?.userReaction === reactionType) {
        // Remove reaction
        await apiService.removeReaction(postId, postType);
        onReactionChange?.(null);
      } else {
        // Add/change reaction
        await apiService.addReaction(postId, postType, reactionType);
        onReactionChange?.(reactionType);
      }
      await loadReactionStats();
    } catch (error) {
      console.error('Failed to update reaction:', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const getReactionIcon = (type: string) => {
    const reaction = reactionTypes.find(r => r.type === type);
    return reaction ? reaction.icon : ThumbsUp;
  };

  const getReactionColor = (type: string) => {
    const reaction = reactionTypes.find(r => r.type === type);
    return reaction ? reaction.color : 'text-gray-500';
  };

  if (!stats) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const totalReactions = stats.totalReactions;
  const userReaction = stats.userReaction;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || !user}
            className={`flex items-center space-x-1 ${
              userReaction ? getReactionColor(userReaction) : 'text-gray-500'
            }`}
          >
            {userReaction ? (
              React.createElement(getReactionIcon(userReaction), { className: "h-4 w-4" })
            ) : (
              <ThumbsUp className="h-4 w-4" />
            )}
            <span>{totalReactions}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="grid grid-cols-4 gap-2">
            {reactionTypes.map((reaction) => {
              const Icon = reaction.icon;
              const count = stats.reactionBreakdown[reaction.type as keyof typeof stats.reactionBreakdown];
              const isActive = userReaction === reaction.type;
              
              return (
                <Button
                  key={reaction.type}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(reaction.type)}
                  className={`flex flex-col items-center space-y-1 h-auto p-2 ${
                    isActive ? reaction.color : 'text-gray-500'
                  }`}
                  disabled={isLoading}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{count}</span>
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      
      {totalReactions > 0 && (
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          {Object.entries(stats.reactionBreakdown)
            .filter(([_, count]) => count > 0)
            .slice(0, 3)
            .map(([type, count]) => {
              const Icon = getReactionIcon(type);
              return (
                <div key={type} className="flex items-center space-x-1">
                  <Icon className={`h-3 w-3 ${getReactionColor(type)}`} />
                  <span>{count}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
