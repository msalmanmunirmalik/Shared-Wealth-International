export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  created_at: string;
}

export interface Session {
  user: User;
  access_token: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large';
  location: string;
  website?: string;
  logo?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface NetworkCompany extends Company {
  connection_strength: number;
  shared_projects: number;
  collaboration_score: number;
}

export interface UserCompany {
  user_id: string;
  company_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}
