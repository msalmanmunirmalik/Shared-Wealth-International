import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// import EventsService from '@/integrations/postgresql/eventsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Globe, 
  Edit, 
  Save, 
  X,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  event_type: string;
  is_virtual: boolean;
  virtual_link: string | null;
  max_participants: number | null;
  current_participants: number;
  company_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
}

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    event_type: 'workshop',
    is_virtual: false,
    virtual_link: '',
    max_participants: '',
    company_id: ''
  });

  useEffect(() => {
    if (user) {
      loadEvents();
      loadUserCompanies();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          companies (
            id,
            name,
            logo_url
          )
        `)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Events load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          companies (
            id,
            name,
            logo_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error loading user companies:', error);
        return;
      }

      const companies = data?.map(item => item.companies).filter(Boolean) || [];
      setUserCompanies(companies);
    } catch (error) {
      console.error('User companies load error:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!user) return;

    setIsCreating(true);
    setError('');

    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: eventForm.title,
          description: eventForm.description,
          start_date: eventForm.start_date,
          end_date: eventForm.end_date,
          location: eventForm.location,
          event_type: eventForm.event_type,
          is_virtual: eventForm.is_virtual,
          virtual_link: eventForm.is_virtual ? eventForm.virtual_link : null,
          max_participants: eventForm.max_participants ? parseInt(eventForm.max_participants) : null,
          company_id: eventForm.company_id || null,
          created_by: user.id,
          status: 'upcoming'
        });

      if (error) {
        console.error('Error creating event:', error);
        setError('Failed to create event');
        return;
      }

      toast({
        title: "Event Created",
        description: "Your event has been created successfully.",
      });

      setShowCreateDialog(false);
      setEventForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        event_type: 'workshop',
        is_virtual: false,
        virtual_link: '',
        max_participants: '',
        company_id: ''
      });
      await loadEvents();
    } catch (error) {
      console.error('Event creation error:', error);
      setError('Failed to create event');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateEvent = async (eventId: string) => {
    setIsEditing(null);
    setError('');

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: eventForm.title,
          description: eventForm.description,
          start_date: eventForm.start_date,
          end_date: eventForm.end_date,
          location: eventForm.location,
          event_type: eventForm.event_type,
          is_virtual: eventForm.is_virtual,
          virtual_link: eventForm.is_virtual ? eventForm.virtual_link : null,
          max_participants: eventForm.max_participants ? parseInt(eventForm.max_participants) : null,
          company_id: eventForm.company_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) {
        console.error('Error updating event:', error);
        setError('Failed to update event');
        return;
      }

      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully.",
      });

      await loadEvents();
    } catch (error) {
      console.error('Event update error:', error);
      setError('Failed to update event');
    }
  };

  const startEditing = (event: Event) => {
    setIsEditing(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      location: event.location,
      event_type: event.event_type,
      is_virtual: event.is_virtual,
      virtual_link: event.virtual_link || '',
      max_participants: event.max_participants?.toString() || '',
      company_id: event.company_id || ''
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEventForm({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      location: '',
      event_type: 'workshop',
      is_virtual: false,
      virtual_link: '',
      max_participants: '',
      company_id: ''
    });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (event.status === 'cancelled') return 'cancelled';
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-purple-100 text-purple-800';
      case 'conference': return 'bg-orange-100 text-orange-800';
      case 'meetup': return 'bg-teal-100 text-teal-800';
      case 'webinar': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.event_type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Events</h1>
            <p className="text-muted-foreground">Discover and create events in the Shared Wealth network</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Create an event to bring the Shared Wealth community together.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Describe your event"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-start">Start Date & Time</Label>
                    <Input
                      id="event-start"
                      type="datetime-local"
                      value={eventForm.start_date}
                      onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-end">End Date & Time</Label>
                    <Input
                      id="event-end"
                      type="datetime-local"
                      value={eventForm.end_date}
                      onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <select
                      id="event-type"
                      value={eventForm.event_type}
                      onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="meetup">Meetup</option>
                      <option value="webinar">Webinar</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="Event location"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={eventForm.is_virtual}
                      onChange={(e) => setEventForm({ ...eventForm, is_virtual: e.target.checked })}
                      className="rounded"
                    />
                    <span>Virtual Event</span>
                  </Label>
                </div>
                {eventForm.is_virtual && (
                  <div className="space-y-2">
                    <Label htmlFor="virtual-link">Virtual Meeting Link</Label>
                    <Input
                      id="virtual-link"
                      value={eventForm.virtual_link}
                      onChange={(e) => setEventForm({ ...eventForm, virtual_link: e.target.value })}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-participants">Max Participants</Label>
                    <Input
                      id="max-participants"
                      type="number"
                      value={eventForm.max_participants}
                      onChange={(e) => setEventForm({ ...eventForm, max_participants: e.target.value })}
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-id">Company (Optional)</Label>
                    <select
                      id="company-id"
                      value={eventForm.company_id}
                      onChange={(e) => setEventForm({ ...eventForm, company_id: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">No company</option>
                      {userCompanies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Event'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Types</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
            <option value="meetup">Meetup</option>
            <option value="webinar">Webinar</option>
          </select>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents
                .filter(event => getEventStatus(event) === 'upcoming')
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => startEditing(event)}
                    isEditing={isEditing === event.id}
                    eventForm={eventForm}
                    setEventForm={setEventForm}
                    onSave={() => handleUpdateEvent(event.id)}
                    onCancel={cancelEditing}
                    userCompanies={userCompanies}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="ongoing" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents
                .filter(event => getEventStatus(event) === 'ongoing')
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => startEditing(event)}
                    isEditing={isEditing === event.id}
                    eventForm={eventForm}
                    setEventForm={setEventForm}
                    onSave={() => handleUpdateEvent(event.id)}
                    onCancel={cancelEditing}
                    userCompanies={userCompanies}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents
                .filter(event => getEventStatus(event) === 'completed')
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => startEditing(event)}
                    isEditing={isEditing === event.id}
                    eventForm={eventForm}
                    setEventForm={setEventForm}
                    onSave={() => handleUpdateEvent(event.id)}
                    onCancel={cancelEditing}
                    userCompanies={userCompanies}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents
                .filter(event => event.created_by === user?.id)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => startEditing(event)}
                    isEditing={isEditing === event.id}
                    eventForm={eventForm}
                    setEventForm={setEventForm}
                    onSave={() => handleUpdateEvent(event.id)}
                    onCancel={cancelEditing}
                    userCompanies={userCompanies}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Event Card Component
interface EventCardProps {
  event: Event;
  onEdit: () => void;
  isEditing: boolean;
  eventForm: any;
  setEventForm: (form: any) => void;
  onSave: () => void;
  onCancel: () => void;
  userCompanies: Company[];
}

const EventCard = ({ 
  event, 
  onEdit, 
  isEditing, 
  eventForm, 
  setEventForm, 
  onSave, 
  onCancel,
  userCompanies 
}: EventCardProps) => {
  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (event.status === 'cancelled') return 'cancelled';
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-purple-100 text-purple-800';
      case 'conference': return 'bg-orange-100 text-orange-800';
      case 'meetup': return 'bg-teal-100 text-teal-800';
      case 'webinar': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getEventTypeColor(event.event_type)}>
                {event.event_type}
              </Badge>
              <Badge className={getStatusColor(getEventStatus(event))}>
                {getEventStatus(event)}
              </Badge>
            </div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            {event.company_id && (
              <CardDescription className="text-sm">
                Hosted by {event.companies?.name}
              </CardDescription>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`title-${event.id}`}>Title</Label>
              <Input
                id={`title-${event.id}`}
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${event.id}`}>Description</Label>
              <Textarea
                id={`description-${event.id}`}
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor={`start-${event.id}`}>Start</Label>
                <Input
                  id={`start-${event.id}`}
                  type="datetime-local"
                  value={eventForm.start_date}
                  onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`end-${event.id}`}>End</Label>
                <Input
                  id={`end-${event.id}`}
                  type="datetime-local"
                  value={eventForm.end_date}
                  onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={onSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {event.description}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date(event.start_date).toLocaleTimeString()} - {new Date(event.end_date).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{event.is_virtual ? 'Virtual Event' : event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>
                  {event.current_participants}
                  {event.max_participants && ` / ${event.max_participants}`} participants
                </span>
              </div>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button size="sm" className="flex-1">
                Join Event
              </Button>
              {event.is_virtual && event.virtual_link && (
                <Button size="sm" variant="outline" asChild>
                  <a href={event.virtual_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Events; 