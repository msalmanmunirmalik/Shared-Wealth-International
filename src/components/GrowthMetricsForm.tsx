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
  companyId: string;
  onSuccess?: () => void;
}

const GrowthMetricsForm = ({ companyId, onSuccess }: GrowthMetricsFormProps) => {
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
    { value: 'revenue', label: 'Revenue', icon: DollarSign, unit: 'USD' },
    { value: 'employees', label: 'Employees', icon: Users, unit: 'count' },
    { value: 'customers', label: 'Customers', icon: Users, unit: 'count' },
    { value: 'partnerships', label: 'Partnerships', icon: Target, unit: 'count' },
    { value: 'media_reach', label: 'Media Reach', icon: BarChart3, unit: 'impressions' },
    { value: 'market_share', label: 'Market Share', icon: BarChart3, unit: 'percentage' },
    { value: 'product_launches', label: 'Product Launches', icon: Target, unit: 'count' },
    { value: 'investments', label: 'Investments Raised', icon: DollarSign, unit: 'USD' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('company_growth_metrics')
        .insert({
          company_id: companyId,
          metric_date: formData.metric_date,
          metric_type: formData.metric_type,
          metric_value: parseFloat(formData.metric_value),
          metric_unit: formData.metric_unit,
          notes: formData.notes,
          shared_wealth_impact: formData.shared_wealth_impact
        });

      if (error) {
        console.error('Error creating growth metric:', error);
        toast({
          title: "Error",
          description: "Failed to log growth metric",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Growth metric logged successfully!",
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
    const selectedMetric = metricTypes.find(m => m.value === value);
    setFormData({
      ...formData,
      metric_type: value,
      metric_unit: selectedMetric?.unit || ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Log Growth Metric
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Log Growth Metric
          </DialogTitle>
          <DialogDescription>
            Track your company's growth and measure Shared Wealth International's impact
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metric Date */}
          <div className="space-y-2">
            <Label htmlFor="metric_date">Metric Date *</Label>
            <Input
              id="metric_date"
              type="date"
              value={formData.metric_date}
              onChange={(e) => setFormData({ ...formData, metric_date: e.target.value })}
              required
            />
          </div>

          {/* Metric Type */}
          <div className="space-y-2">
            <Label htmlFor="metric_type">Metric Type *</Label>
            <Select
              value={formData.metric_type}
              onValueChange={handleMetricTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select metric type" />
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

          {/* Metric Value */}
          <div className="space-y-2">
            <Label htmlFor="metric_value">Metric Value *</Label>
            <Input
              id="metric_value"
              type="number"
              step="any"
              value={formData.metric_value}
              onChange={(e) => setFormData({ ...formData, metric_value: e.target.value })}
              placeholder="Enter the numeric value"
              required
            />
          </div>

          {/* Metric Unit */}
          <div className="space-y-2">
            <Label htmlFor="metric_unit">Unit</Label>
            <Input
              id="metric_unit"
              value={formData.metric_unit}
              onChange={(e) => setFormData({ ...formData, metric_unit: e.target.value })}
              placeholder="e.g., USD, count, percentage, etc."
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional context about this growth metric..."
              rows={3}
            />
          </div>

          {/* Shared Wealth Impact */}
          <div className="space-y-2">
            <Label htmlFor="shared_wealth_impact">Shared Wealth International Impact</Label>
            <Textarea
              id="shared_wealth_impact"
              value={formData.shared_wealth_impact}
              onChange={(e) => setFormData({ ...formData, shared_wealth_impact: e.target.value })}
              placeholder="How did Shared Wealth International contribute to this growth? (e.g., introduced you to key partners, provided networking opportunities, shared best practices, etc.)"
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              This helps us track how Shared Wealth International is driving company growth
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
              {isSubmitting ? 'Logging Metric...' : 'Log Growth Metric'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GrowthMetricsForm; 