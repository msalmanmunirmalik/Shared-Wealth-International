import React, { useState } from 'react';
import { Share2, Copy, ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ShareButtonProps {
  contentId: string;
  contentType: 'forum_topic' | 'forum_reply' | 'company_post' | 'event' | 'project';
  contentTitle?: string;
  onShare?: (shareType: string) => void;
  className?: string;
}

const shareTypes = [
  { type: 'internal', label: 'Internal', icon: MessageCircle, color: 'text-blue-500' },
  { type: 'linkedin', label: 'LinkedIn', icon: ExternalLink, color: 'text-blue-600' },
  { type: 'twitter', label: 'Twitter', icon: ExternalLink, color: 'text-blue-400' },
  { type: 'facebook', label: 'Facebook', icon: ExternalLink, color: 'text-blue-700' },
  { type: 'email', label: 'Email', icon: Mail, color: 'text-gray-600' },
];

export const ShareButton: React.FC<ShareButtonProps> = ({
  contentId,
  contentType,
  contentTitle,
  onShare,
  className = ''
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [shareableLink, setShareableLink] = useState('');

  const handleShare = async (shareType: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await apiService.shareContent(
        contentId,
        contentType,
        shareType,
        shareType,
        shareMessage || undefined
      );
      
      onShare?.(shareType);
      toast.success(`Shared to ${shareType}!`);
      
      if (shareType === 'internal') {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to share content:', error);
      toast.error('Failed to share content');
    } finally {
      setIsLoading(false);
    }
  };

  const generateShareableLink = async (platform: string) => {
    try {
      const response = await apiService.generateShareableLink(contentId, contentType, platform);
      if (response.success) {
        setShareableLink(response.data.shareableLink);
        await navigator.clipboard.writeText(response.data.shareableLink);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to generate shareable link:', error);
      toast.error('Failed to generate link');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy');
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!user}
          className={`flex items-center space-x-1 ${className}`}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Share {contentTitle || 'Content'}</h3>
            <Label htmlFor="share-message">Message (optional)</Label>
            <Textarea
              id="share-message"
              placeholder="Add a message..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Share to:</Label>
            <div className="grid grid-cols-2 gap-2">
              {shareTypes.map((share) => {
                const Icon = share.icon;
                return (
                  <Button
                    key={share.type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(share.type)}
                    disabled={isLoading}
                    className={`flex items-center space-x-2 ${share.color}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{share.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Or copy link:</Label>
            <div className="flex space-x-2">
              <Input
                value={shareableLink}
                placeholder="Click generate to create link"
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateShareableLink('internal')}
                disabled={isLoading}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
