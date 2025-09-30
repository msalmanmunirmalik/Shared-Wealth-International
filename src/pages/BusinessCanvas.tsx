import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building, 
  Users, 
  Target, 
  DollarSign, 
  Lightbulb, 
  Handshake,
  Save,
  Download,
  Share2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  CheckCircle,
  X,
  Star,
  Calendar,
  Globe
} from "lucide-react";

interface CanvasSection {
  id: string;
  title: string;
  content: string;
  color: string;
  icon: React.ReactNode;
  placeholder: string;
}

interface BusinessCanvas {
  id: string;
  name: string;
  description: string;
  sections: {
    valueProposition: string;
    customerSegments: string;
    channels: string;
    customerRelationships: string;
    revenueStreams: string;
    keyResources: string;
    keyActivities: string;
    keyPartnerships: string;
    costStructure: string;
  };
  collaborators: string[];
  version: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessCanvas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [canvases, setCanvases] = useState<BusinessCanvas[]>([]);
  const [currentCanvas, setCurrentCanvas] = useState<BusinessCanvas | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [newCanvasDescription, setNewCanvasDescription] = useState('');

  const canvasSections: CanvasSection[] = [
    {
      id: 'valueProposition',
      title: 'Value Proposition',
      content: '',
      color: 'bg-blue-100 border-blue-300',
      icon: <Lightbulb className="w-5 h-5 text-blue-600" />,
      placeholder: 'What unique value do you deliver to your customers?'
    },
    {
      id: 'customerSegments',
      title: 'Customer Segments',
      content: '',
      color: 'bg-green-100 border-green-300',
      icon: <Users className="w-5 h-5 text-green-600" />,
      placeholder: 'Who are your target customers?'
    },
    {
      id: 'channels',
      title: 'Channels',
      content: '',
      color: 'bg-purple-100 border-purple-300',
      icon: <Target className="w-5 h-5 text-purple-600" />,
      placeholder: 'How do you reach your customers?'
    },
    {
      id: 'customerRelationships',
      title: 'Customer Relationships',
      content: '',
      color: 'bg-yellow-100 border-yellow-300',
      icon: <Handshake className="w-5 h-5 text-yellow-600" />,
      placeholder: 'What type of relationship do you have with your customers?'
    },
    {
      id: 'revenueStreams',
      title: 'Revenue Streams',
      content: '',
      color: 'bg-green-100 border-green-300',
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      placeholder: 'How do you generate revenue?'
    },
    {
      id: 'keyResources',
      title: 'Key Resources',
      content: '',
      color: 'bg-orange-100 border-orange-300',
      icon: <Building className="w-5 h-5 text-orange-600" />,
      placeholder: 'What resources do you need to operate?'
    },
    {
      id: 'keyActivities',
      title: 'Key Activities',
      content: '',
      color: 'bg-red-100 border-red-300',
      icon: <Target className="w-5 h-5 text-red-600" />,
      placeholder: 'What activities are crucial for your business?'
    },
    {
      id: 'keyPartnerships',
      title: 'Key Partnerships',
      content: '',
      color: 'bg-indigo-100 border-indigo-300',
      icon: <Handshake className="w-5 h-5 text-indigo-600" />,
      placeholder: 'Who are your key partners and suppliers?'
    },
    {
      id: 'costStructure',
      title: 'Cost Structure',
      content: '',
      color: 'bg-pink-100 border-pink-300',
      icon: <DollarSign className="w-5 h-5 text-pink-600" />,
      placeholder: 'What are your major cost drivers?'
    }
  ];

  useEffect(() => {
    loadCanvases();
  }, []);

  const loadCanvases = () => {
    setIsLoading(true);
    // Simulate loading with sample data
    setTimeout(() => {
      const sampleCanvases: BusinessCanvas[] = [
        {
          id: '1',
          name: 'Sample Business Model',
          description: 'A sample business model canvas to get you started',
          sections: {
            valueProposition: 'Innovative solutions for sustainable development',
            customerSegments: 'Small to medium enterprises, NGOs, Government agencies',
            channels: 'Direct sales, Online platform, Partner networks',
            customerRelationships: 'Long-term partnerships, Consultative approach',
            revenueStreams: 'Subscription fees, Consulting services, Licensing',
            keyResources: 'Expert team, Technology platform, Partnerships',
            keyActivities: 'Research & Development, Customer support, Training',
            keyPartnerships: 'Academic institutions, Technology providers, NGOs',
            costStructure: 'Personnel, Technology infrastructure, Marketing'
          },
          collaborators: ['user1', 'user2'],
          version: 1,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setCanvases(sampleCanvases);
      setIsLoading(false);
    }, 1000);
  };

  const createNewCanvas = () => {
    if (!newCanvasName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a canvas name",
        variant: "destructive"
      });
      return;
    }

    const newCanvas: BusinessCanvas = {
      id: Date.now().toString(),
      name: newCanvasName,
      description: newCanvasDescription,
      sections: {
        valueProposition: '',
        customerSegments: '',
        channels: '',
        customerRelationships: '',
        revenueStreams: '',
        keyResources: '',
        keyActivities: '',
        keyPartnerships: '',
        costStructure: ''
      },
      collaborators: user ? [user.id] : [],
      version: 1,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCanvases([...canvases, newCanvas]);
    setCurrentCanvas(newCanvas);
    setNewCanvasName('');
    setNewCanvasDescription('');
    setShowCreateDialog(false);
    
    toast({
      title: "Success",
      description: "New business canvas created!",
    });
  };

  const updateSection = (sectionId: string, content: string) => {
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      sections: {
        ...currentCanvas.sections,
        [sectionId]: content
      },
      updatedAt: new Date()
    };

    setCurrentCanvas(updatedCanvas);
    
    // Update in canvases array
    setCanvases(canvases.map(canvas => 
      canvas.id === currentCanvas.id ? updatedCanvas : canvas
    ));
  };

  const saveCanvas = async () => {
    if (!currentCanvas) return;

    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Success",
        description: "Canvas saved successfully!",
      });
    }, 1000);
  };

  const exportCanvas = () => {
    if (!currentCanvas) return;

    const canvasData = {
      name: currentCanvas.name,
      description: currentCanvas.description,
      sections: currentCanvas.sections,
      version: currentCanvas.version,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(canvasData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCanvas.name}-business-canvas.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Canvas exported successfully!",
    });
  };

  const shareCanvas = () => {
    if (!currentCanvas) return;

    const shareData = {
      title: currentCanvas.name,
      text: `Check out my business model canvas: ${currentCanvas.name}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Canvas link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading Business Canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Model Canvas</h1>
          <p className="text-lg text-gray-600">Create, edit, and share your business model canvas</p>
        </div>

        {/* Canvas Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Select value={currentCanvas?.id || ''} onValueChange={(value) => {
                const canvas = canvases.find(c => c.id === value);
                setCurrentCanvas(canvas || null);
              }}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a canvas" />
                </SelectTrigger>
                <SelectContent>
                  {canvases.map((canvas) => (
                    <SelectItem key={canvas.id} value={canvas.id}>
                      {canvas.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Canvas
              </Button>
            </div>

            {currentCanvas && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={shareCanvas}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={exportCanvas}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={saveCanvas} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Grid */}
        {currentCanvas ? (
          <div className="grid grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
                    Value Proposition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What unique value do you deliver to your customers?"
                    value={currentCanvas.sections.valueProposition}
                    onChange={(e) => updateSection('valueProposition', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    Customer Segments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Who are your target customers?"
                    value={currentCanvas.sections.customerSegments}
                    onChange={(e) => updateSection('customerSegments', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Target className="w-4 h-4 mr-2 text-purple-600" />
                    Channels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="How do you reach your customers?"
                    value={currentCanvas.sections.channels}
                    onChange={(e) => updateSection('channels', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Center Column */}
            <div className="space-y-4">
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Handshake className="w-4 h-4 mr-2 text-yellow-600" />
                    Customer Relationships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What type of relationship do you have with your customers?"
                    value={currentCanvas.sections.customerRelationships}
                    onChange={(e) => updateSection('customerRelationships', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="bg-center bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-dashed border-gray-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-center text-gray-700">
                    {currentCanvas.name}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {currentCanvas.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-sm text-gray-600">Business Model Canvas</p>
                  <p className="text-xs text-gray-500 mt-1">Version {currentCanvas.version}</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    Revenue Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="How do you generate revenue?"
                    value={currentCanvas.sections.revenueStreams}
                    onChange={(e) => updateSection('revenueStreams', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Building className="w-4 h-4 mr-2 text-orange-600" />
                    Key Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What resources do you need to operate?"
                    value={currentCanvas.sections.keyResources}
                    onChange={(e) => updateSection('keyResources', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Target className="w-4 h-4 mr-2 text-red-600" />
                    Key Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What activities are crucial for your business?"
                    value={currentCanvas.sections.keyActivities}
                    onChange={(e) => updateSection('keyActivities', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="bg-indigo-50 border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Handshake className="w-4 h-4 mr-2 text-indigo-600" />
                    Key Partnerships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Who are your key partners and suppliers?"
                    value={currentCanvas.sections.keyPartnerships}
                    onChange={(e) => updateSection('keyPartnerships', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="bg-pink-50 border-pink-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-pink-600" />
                    Cost Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What are your major cost drivers?"
                    value={currentCanvas.sections.costStructure}
                    onChange={(e) => updateSection('costStructure', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Canvas Selected</h3>
            <p className="text-gray-500 mb-6">Create a new canvas or select an existing one to get started</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Canvas
            </Button>
          </div>
        )}

        {/* Create Canvas Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Business Canvas</DialogTitle>
              <DialogDescription>
                Start building your business model with a new canvas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="canvas-name">Canvas Name</Label>
                <Input
                  id="canvas-name"
                  placeholder="Enter canvas name"
                  value={newCanvasName}
                  onChange={(e) => setNewCanvasName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="canvas-description">Description</Label>
                <Textarea
                  id="canvas-description"
                  placeholder="Describe your business model"
                  value={newCanvasDescription}
                  onChange={(e) => setNewCanvasDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createNewCanvas}>
                  Create Canvas
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BusinessCanvas;
