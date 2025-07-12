import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Director {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

export const DirectorsManager = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchDirectors = async () => {
    try {
      const { data, error } = await supabase
        .from('directors')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setDirectors(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load directors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, []);

  const saveDirector = async (director: Partial<Director>) => {
    try {
      if (director.id) {
        // Update existing director
        const { error } = await supabase
          .from('directors')
          .update({
            name: director.name,
            position: director.position,
            bio: director.bio,
            image_url: director.image_url,
            is_active: director.is_active
          })
          .eq('id', director.id);
        if (error) throw error;
      } else {
        // Create new director
        const { error } = await supabase
          .from('directors')
          .insert({
            name: director.name!,
            position: director.position!,
            bio: director.bio,
            image_url: director.image_url,
            display_order: directors.length,
            is_active: director.is_active ?? true
          });
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Director ${director.id ? 'updated' : 'created'} successfully`
      });
      
      fetchDirectors();
      setEditingDirector(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save director",
        variant: "destructive"
      });
    }
  };

  const deleteDirector = async (id: string) => {
    if (!confirm('Are you sure you want to delete this director?')) return;

    try {
      const { error } = await supabase
        .from('directors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Director deleted successfully"
      });
      
      fetchDirectors();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete director",
        variant: "destructive"
      });
    }
  };

  const DirectorForm = ({ director, onSave, onCancel }: {
    director?: Director;
    onSave: (director: Partial<Director>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: director?.name || '',
      position: director?.position || '',
      bio: director?.bio || '',
      image_url: director?.image_url || '',
      is_active: director?.is_active ?? true
    });

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
          />
        </div>
        
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
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
          <Button onClick={() => onSave({ ...director, ...formData })}>
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
    return <div className="flex justify-center p-8">Loading directors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Directors ({directors.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDirector(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Director
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDirector ? 'Edit Director' : 'Add New Director'}
              </DialogTitle>
            </DialogHeader>
            <DirectorForm
              director={editingDirector || undefined}
              onSave={saveDirector}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {directors.map((director) => (
          <Card key={director.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  {director.image_url && (
                    <img
                      src={director.image_url}
                      alt={director.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">{director.name}</h4>
                    <p className="text-sm text-muted-foreground">{director.position}</p>
                    {director.bio && (
                      <p className="text-sm mt-2 line-clamp-2">{director.bio}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: {director.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingDirector(director);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteDirector(director.id)}
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