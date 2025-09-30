import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface FollowButtonProps {
  targetUserId: string;
  targetUserName?: string;
  connectionType?: 'follow' | 'friend' | 'colleague' | 'mentor';
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

interface ConnectionStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  targetUserName,
  connectionType = 'follow',
  onFollowChange,
  className = ''
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ConnectionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (targetUserId && user?.id) {
      loadConnectionStats();
    }
  }, [targetUserId, user?.id]);

  const loadConnectionStats = async () => {
    try {
      const response = await apiService.getConnectionStats(targetUserId, user?.id);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load connection stats:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !stats) return;
    
    setIsLoading(true);
    try {
      if (stats.isFollowing) {
        await apiService.unfollowUser(targetUserId);
        onFollowChange?.(false);
      } else {
        await apiService.followUser(targetUserId, connectionType);
        onFollowChange?.(true);
      }
      await loadConnectionStats();
    } catch (error) {
      console.error('Failed to update follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!stats || !user) {
    return (
      <div className={`h-8 w-20 bg-gray-200 rounded animate-pulse ${className}`} />
    );
  }

  if (user.id === targetUserId) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Users className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-500">
          {stats.followersCount} followers
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant={stats.isFollowing ? "outline" : "default"}
        size="sm"
        onClick={handleFollowToggle}
        disabled={isLoading}
        className="flex items-center space-x-1"
      >
        {stats.isFollowing ? (
          <>
            <UserMinus className="h-4 w-4" />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            <span>Follow</span>
          </>
        )}
      </Button>
      
      <div className="flex items-center space-x-3 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Users className="h-3 w-3" />
          <span>{stats.followersCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <UserPlus className="h-3 w-3" />
          <span>{stats.followingCount}</span>
        </div>
      </div>
    </div>
  );
};
