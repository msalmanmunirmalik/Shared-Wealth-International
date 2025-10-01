import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Target, DollarSign, Users, Calendar, BarChart3 } from 'lucide-react';

interface GrowthMetricsFormProps {
  companyId?: string;
  onSuccess?: () => void;
}

const GrowthMetricsForm = ({ companyId = 'demo-company-id', onSuccess }: GrowthMetricsFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    metric_date: '',
    metric_type: '',
    metric_value: '',
    metric_unit: '',
    notes: '',
    shared_wealth_impact: ''
  });

  const metricTypes = [
    { value: 'revenue', label: 'Revenue Growth', icon: DollarSign, unit: 'USD' },
    { value: 'employees', label: 'Team Growth', icon: Users, unit: 'count' },
    { value: 'customers', label: 'Customer Growth', icon: Users, unit: 'count' },
    { value: 'partnerships', label: 'New Partnerships', icon: Target, unit: 'count' },
    { value: 'media_reach', label: 'Media Reach', icon: BarChart3, unit: 'impressions' },
    { value: 'market_share', label: 'Market Expansion', icon: BarChart3, unit: 'percentage' },
    { value: 'product_launches', label: 'Product Launches', icon: Target, unit: 'count' },
    { value: 'investments', label: 'Investment Raised', icon: DollarSign, unit: 'USD' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // For demo purposes, just show success
      toast({
        title: "Success",
        description: "Growth metric logged successfully! Your impact story has been shared.",
      });

      // Reset form
      setFormData({
        metric_date: '',
        metric_type: '',
        metric_value: '',
        metric_unit: '',
        notes: '',
        shared_wealth_impact: ''
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Growth metric creation error:', error);
      toast({
        title: "Error",
        description: "Failed to log growth metric",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMetricTypeChange = (value: string) => {
    const selectedMetric = metricTypes.find(metric => metric.value === value);
    setFormData({
      ...formData,
      metric_type: value,
      metric_unit: selectedMetric?.unit || ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <TrendingUp className="w-4 h-4 mr-2" />
          Track Growth
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Track Growth Impact</DialogTitle>
          <DialogDescription>
            Log how SWI contributed to your company's growth and success
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metric_type">Growth Type *</Label>
              <Select value={formData.metric_type} onValueChange={handleMetricTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select growth type" />
                </SelectTrigger>
                <SelectContent>
                  {metricTypes.map((metric) => (
                    <SelectItem key={metric.value} value={metric.value}>
                      <div className="flex items-center gap-2">
                        <metric.icon className="w-4 h-4" />
                        {metric.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metric_date">When did this growth occur? *</Label>
              <Input
                id="metric_date"
                type="date"
                value={formData.metric_date}
                onChange={(e) => setFormData({...formData, metric_date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metric_value">Growth Value *</Label>
              <Input
                id="metric_value"
                type="number"
                step="0.01"
                value={formData.metric_value}
                onChange={(e) => setFormData({...formData, metric_value: e.target.value})}
                placeholder="e.g., 40, 150, 2.5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metric_unit">Unit *</Label>
              <Input
                id="metric_unit"
                value={formData.metric_unit}
                onChange={(e) => setFormData({...formData, metric_unit: e.target.value})}
                placeholder="e.g., percentage, USD, count"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shared_wealth_impact">How did SWI help? *</Label>
            <Textarea
              id="shared_wealth_impact"
              value={formData.shared_wealth_impact}
              onChange={(e) => setFormData({...formData, shared_wealth_impact: e.target.value})}
              placeholder="e.g., Connected with investors, facilitated partnerships, provided market access, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Context</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional details about this growth..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : 'Log Growth'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GrowthMetricsForm; 