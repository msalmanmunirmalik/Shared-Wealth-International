import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw } from 'lucide-react';

interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: any;
}

export const ContentManager = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('section_key');

      if (error) throw error;
      setSections(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load content sections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const updateSection = (sectionKey: string, field: string, value: any) => {
    setSections(sections.map(section => 
      section.section_key === sectionKey
        ? {
            ...section,
            content: {
              ...section.content,
              [field]: value
            }
          }
        : section
    ));
  };

  const saveSection = async (section: ContentSection) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('content_sections')
        .update({ content: section.content })
        .eq('id', section.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${section.title} updated successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading content sections...</div>;
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{section.title}</CardTitle>
            <Button 
              onClick={() => saveSection(section)}
              disabled={saving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.section_key === 'hero' && (
              <>
                <div>
                  <Label htmlFor={`${section.section_key}-title`}>Title</Label>
                  <Input
                    id={`${section.section_key}-title`}
                    value={section.content.title || ''}
                    onChange={(e) => updateSection(section.section_key, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${section.section_key}-subtitle`}>Subtitle</Label>
                  <Input
                    id={`${section.section_key}-subtitle`}
                    value={section.content.subtitle || ''}
                    onChange={(e) => updateSection(section.section_key, 'subtitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${section.section_key}-description`}>Description</Label>
                  <Textarea
                    id={`${section.section_key}-description`}
                    value={section.content.description || ''}
                    onChange={(e) => updateSection(section.section_key, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            {section.section_key === 'about' && (
              <>
                <div>
                  <Label htmlFor={`${section.section_key}-title`}>Title</Label>
                  <Input
                    id={`${section.section_key}-title`}
                    value={section.content.title || ''}
                    onChange={(e) => updateSection(section.section_key, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${section.section_key}-mission`}>Mission</Label>
                  <Textarea
                    id={`${section.section_key}-mission`}
                    value={section.content.mission || ''}
                    onChange={(e) => updateSection(section.section_key, 'mission', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor={`${section.section_key}-vision`}>Vision</Label>
                  <Textarea
                    id={`${section.section_key}-vision`}
                    value={section.content.vision || ''}
                    onChange={(e) => updateSection(section.section_key, 'vision', e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            {section.section_key === 'contact' && (
              <>
                <div>
                  <Label htmlFor={`${section.section_key}-email`}>Email</Label>
                  <Input
                    id={`${section.section_key}-email`}
                    type="email"
                    value={section.content.email || ''}
                    onChange={(e) => updateSection(section.section_key, 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${section.section_key}-phone`}>Phone</Label>
                  <Input
                    id={`${section.section_key}-phone`}
                    value={section.content.phone || ''}
                    onChange={(e) => updateSection(section.section_key, 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${section.section_key}-address`}>Address</Label>
                  <Textarea
                    id={`${section.section_key}-address`}
                    value={section.content.address || ''}
                    onChange={(e) => updateSection(section.section_key, 'address', e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-center">
        <Button onClick={fetchSections} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};