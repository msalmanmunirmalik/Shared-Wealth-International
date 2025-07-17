import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';

const CompanyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const { toast } = useToast();
  const session = useSession();
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not logged in');
        // Get company association
        const { data: companyUser, error: cuError } = await supabase
          .from('company_users')
          .select('company_id, role, companies(*)')
          .eq('user_id', user.id)
          .single();
        if (cuError || !companyUser) {
          setCompany(null);
          setLoading(false);
          return;
        }
        setCompany(companyUser.companies);
        // Fetch members
        const { data: memberRows } = await supabase
          .from('company_users')
          .select('user_id, role, users(email)')
          .eq('company_id', companyUser.company_id);
        setMembers(memberRows || []);
        // Fetch posts
        const { data: postRows } = await supabase
          .from('company_posts')
          .select('*')
          .eq('company_id', companyUser.company_id)
          .order('created_at', { ascending: false });
        setPosts(postRows || []);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  // Helper: is founder/admin
  const isFounder = members.find(m => m.user_id === session?.user?.id && (m.role === 'founder' || m.role === 'admin'));

  // Edit company info
  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update(editFields)
        .eq('id', company.id);
      if (error) throw error;
      toast({ title: 'Company updated' });
      setEditing(false);
      setCompany({ ...company, ...editFields });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Invite member
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      // Find user by email
      const { data: userRows, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail)
        .single();
      if (userError) throw new Error('User not found. Ask them to register first.');
      // Add to company_users
      const { error: cuError } = await supabase
        .from('company_users')
        .insert({ company_id: company.id, user_id: userRows.id, role: 'member' });
      if (cuError) throw cuError;
      toast({ title: 'Invite sent' });
      setInviteEmail('');
      // Refresh members
      const { data: memberRows } = await supabase
        .from('company_users')
        .select('user_id, role, users(email)')
        .eq('company_id', company.id);
      setMembers(memberRows || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setInviteLoading(false);
    }
  };

  // Create post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');
      const { error } = await supabase
        .from('company_posts')
        .insert({ company_id: company.id, user_id: user.id, title: postTitle, content: postContent });
      if (error) throw error;
      toast({ title: 'Post created' });
      setPostTitle('');
      setPostContent('');
      // Refresh posts
      const { data: postRows } = await supabase
        .from('company_posts')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      setPosts(postRows || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setPostLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!company) {
    return (
      <div className="p-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Company Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are not associated with a company. Please register or join a company first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Info</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleEditCompany} className="space-y-2">
              <div>
                <Label>Name</Label>
                <Input value={editFields.name ?? company.name} onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <Label>Sector</Label>
                <Input value={editFields.sector ?? company.sector} onChange={e => setEditFields(f => ({ ...f, sector: e.target.value }))} required />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={editFields.website ?? company.website} onChange={e => setEditFields(f => ({ ...f, website: e.target.value }))} />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={editFields.location ?? company.location} onChange={e => setEditFields(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={editFields.description ?? company.description} onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>Save</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div><strong>Name:</strong> {company.name}</div>
              <div><strong>Sector:</strong> {company.sector}</div>
              <div><strong>Website:</strong> {company.website}</div>
              <div><strong>Location:</strong> {company.location}</div>
              <div><strong>Description:</strong> {company.description}</div>
              {isFounder && (
                <Button className="mt-2" size="sm" onClick={() => { setEditing(true); setEditFields({}); }}>Edit</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {members.map(m => (
              <li key={m.user_id}>{m.users?.email} ({m.role})</li>
            ))}
          </ul>
          {isFounder && (
            <form onSubmit={handleInvite} className="flex gap-2 mt-4">
              <Input type="email" placeholder="Invite by email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
              <Button type="submit" disabled={inviteLoading}>Invite</Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Company News & Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-2 mb-4">
            <Input placeholder="Title" value={postTitle} onChange={e => setPostTitle(e.target.value)} required />
            <Input placeholder="Content" value={postContent} onChange={e => setPostContent(e.target.value)} required />
            <Button type="submit" disabled={postLoading}>Post</Button>
          </form>
          <ul className="space-y-2">
            {posts.length === 0 && <li>No posts yet.</li>}
            {posts.map(post => (
              <li key={post.id} className="border-b pb-2">
                <div className="font-semibold">{post.title}</div>
                <div className="text-sm text-muted-foreground">{post.created_at?.slice(0, 10)}</div>
                <div>{post.content}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard; 