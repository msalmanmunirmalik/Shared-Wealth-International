import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Users, Target, MessageSquare, Plus, X, Handshake } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
}

interface CollaborationMeetingFormProps {
  companyId?: string;
  onSuccess?: () => void;
}

const CollaborationMeetingForm = ({ companyId = 'demo-company-id', onSuccess }: CollaborationMeetingFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [participants, setParticipants] = useState<string[]>(['']);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    meeting_title: '',
    meeting_date: '',
    participants: [''],
    meeting_notes: '',
    outcomes: '',
    impact_score: '',
    shared_wealth_contribution: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, logo_url')
        .eq('approved', true)
        .order('name');

      if (error) {
        console.error('Error loading companies:', error);
        return;
      }

      setCompanies(data || []);
    } catch (error) {
      console.error('Companies load error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Filter out empty participant entries
      const validParticipants = participants.filter(p => p.trim() !== '');

      if (validParticipants.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one participant",
          variant: "destructive"
        });
        return;
      }

      // For demo purposes, just show success
      toast({
        title: "Success",
        description: "Meeting logged successfully! Your impact story has been shared.",
      });

      // Reset form
      setFormData({
        meeting_title: '',
        meeting_date: '',
        participants: [''],
        meeting_notes: '',
        outcomes: '',
        impact_score: '',
        shared_wealth_contribution: ''
      });
      setParticipants(['']);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Meeting creation error:', error);
      toast({
        title: "Error",
        description: "Failed to log meeting",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Handshake className="w-4 h-4 mr-2" />
          Log SWI Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log SWI Meeting</DialogTitle>
          <DialogDescription>
            Record a meeting facilitated by Shared Wealth International and its outcomes
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_title">Meeting Title *</Label>
              <Input
                id="meeting_title"
                value={formData.meeting_title}
                onChange={(e) => setFormData({...formData, meeting_title: e.target.value})}
                placeholder="e.g., Strategic Partnership Meeting"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meeting_date">Meeting Date *</Label>
              <Input
                id="meeting_date"
                type="datetime-local"
                value={formData.meeting_date}
                onChange={(e) => setFormData({...formData, meeting_date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Who did SWI connect you with? *</Label>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    placeholder="e.g., TechFlow, Investor Name, etc."
                  />
                  {participants.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeParticipant(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParticipant}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Participant
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcomes">What were the outcomes? *</Label>
            <Textarea
              id="outcomes"
              value={formData.outcomes}
              onChange={(e) => setFormData({...formData, outcomes: e.target.value})}
              placeholder="e.g., Agreed to partnership, secured investment, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shared_wealth_contribution">How did SWI help? *</Label>
            <Textarea
              id="shared_wealth_contribution"
              value={formData.shared_wealth_contribution}
              onChange={(e) => setFormData({...formData, shared_wealth_contribution: e.target.value})}
              placeholder="e.g., Introduced key decision makers, provided market insights, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact_score">How valuable was this meeting? (1-10) *</Label>
            <Select value={formData.impact_score} onValueChange={(value) => setFormData({...formData, impact_score: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select impact score" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <SelectItem key={score} value={score.toString()}>
                    {score} - {score <= 3 ? 'Low' : score <= 6 ? 'Medium' : score <= 8 ? 'High' : 'Very High'} Impact
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_notes">Additional Notes</Label>
            <Textarea
              id="meeting_notes"
              value={formData.meeting_notes}
              onChange={(e) => setFormData({...formData, meeting_notes: e.target.value})}
              placeholder="Any additional details about the meeting..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : 'Log Meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationMeetingForm; 