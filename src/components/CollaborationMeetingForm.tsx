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
import { Calendar, Users, Target, MessageSquare, Plus, X } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
}

interface CollaborationMeetingFormProps {
  companyId: string;
  onSuccess?: () => void;
}

const CollaborationMeetingForm = ({ companyId, onSuccess }: CollaborationMeetingFormProps) => {
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

      const { error } = await supabase
        .from('collaboration_meetings')
        .insert({
          company_id: companyId,
          meeting_title: formData.meeting_title,
          meeting_date: formData.meeting_date,
          participants: validParticipants,
          meeting_notes: formData.meeting_notes,
          outcomes: formData.outcomes,
          impact_score: formData.impact_score ? parseInt(formData.impact_score) : null,
          shared_wealth_contribution: formData.shared_wealth_contribution,
          created_by: user.id
        });

      if (error) {
        console.error('Error creating meeting:', error);
        toast({
          title: "Error",
          description: "Failed to create meeting log",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Meeting logged successfully!",
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
        description: "Failed to create meeting log",
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
        <Button className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Log Collaboration Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Log Collaboration Meeting
          </DialogTitle>
          <DialogDescription>
            Record a meeting with other Shared Wealth companies and track its impact
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="meeting_title">Meeting Title *</Label>
            <Input
              id="meeting_title"
              value={formData.meeting_title}
              onChange={(e) => setFormData({ ...formData, meeting_title: e.target.value })}
              placeholder="e.g., Partnership Discussion with Pathway"
              required
            />
          </div>

          {/* Meeting Date */}
          <div className="space-y-2">
            <Label htmlFor="meeting_date">Meeting Date *</Label>
            <Input
              id="meeting_date"
              type="datetime-local"
              value={formData.meeting_date}
              onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
              required
            />
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <Label>Participants *</Label>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    placeholder={`Participant ${index + 1} (e.g., Gugs from Pathway)`}
                    required
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
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Participant
              </Button>
            </div>
          </div>

          {/* Meeting Notes */}
          <div className="space-y-2">
            <Label htmlFor="meeting_notes">Meeting Notes</Label>
            <Textarea
              id="meeting_notes"
              value={formData.meeting_notes}
              onChange={(e) => setFormData({ ...formData, meeting_notes: e.target.value })}
              placeholder="Key discussion points, decisions made, action items..."
              rows={4}
            />
          </div>

          {/* Outcomes */}
          <div className="space-y-2">
            <Label htmlFor="outcomes">Outcomes & Results</Label>
            <Textarea
              id="outcomes"
              value={formData.outcomes}
              onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
              placeholder="What was achieved? What value was created? How did this meeting help your company?"
              rows={3}
            />
          </div>

          {/* Impact Score */}
          <div className="space-y-2">
            <Label htmlFor="impact_score">Impact Score (1-10)</Label>
            <Select
              value={formData.impact_score}
              onValueChange={(value) => setFormData({ ...formData, impact_score: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select impact level" />
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

          {/* Shared Wealth Contribution */}
          <div className="space-y-2">
            <Label htmlFor="shared_wealth_contribution">Shared Wealth International Contribution</Label>
            <Textarea
              id="shared_wealth_contribution"
              value={formData.shared_wealth_contribution}
              onChange={(e) => setFormData({ ...formData, shared_wealth_contribution: e.target.value })}
              placeholder="How did Shared Wealth International contribute to this meeting? (e.g., introduced you to the participant, provided platform for connection, facilitated discussion, etc.)"
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              This helps us track how Shared Wealth International is creating value for member companies
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging Meeting...' : 'Log Meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationMeetingForm; 