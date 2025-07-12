import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
}

export const PartnersManager = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load partners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const savePartner = async (partner: Partial<Partner>) => {
    try {
      if (partner.id) {
        // Update existing partner
        const { error } = await supabase
          .from('partners')
          .update({
            name: partner.name,
            logo_url: partner.logo_url,
            description: partner.description,
            website_url: partner.website_url,
            is_active: partner.is_active
          })
          .eq('id', partner.id);
        if (error) throw error;
      } else {
        // Create new partner
        const { error } = await supabase
          .from('partners')
          .insert({
            name: partner.name!,
            logo_url: partner.logo_url,
            description: partner.description,
            website_url: partner.website_url,
            display_order: partners.length,
            is_active: partner.is_active ?? true
          });
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Partner ${partner.id ? 'updated' : 'created'} successfully`
      });
      
      fetchPartners();
      setEditingPartner(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save partner",
        variant: "destructive"
      });
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Partner deleted successfully"
      });
      
      fetchPartners();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete partner",
        variant: "destructive"
      });
    }
  };

  const PartnerForm = ({ partner, onSave, onCancel }: {
    partner?: Partner;
    onSave: (partner: Partial<Partner>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: partner?.name || '',
      logo_url: partner?.logo_url || '',
      description: partner?.description || '',
      website_url: partner?.website_url || '',
      is_active: partner?.is_active ?? true
    });

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => onSave({ ...partner, ...formData })}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading partners...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Partners & Networks ({partners.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPartner(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </DialogTitle>
            </DialogHeader>
            <PartnerForm
              partner={editingPartner || undefined}
              onSave={savePartner}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  {partner.logo_url && (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{partner.name}</h4>
                      {partner.website_url && (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {partner.description && (
                      <p className="text-sm mt-2 text-muted-foreground">{partner.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: {partner.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingPartner(partner);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePartner(partner.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};