import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../src/integrations/postgresql/config.js';
import { DatabaseService } from '../src/integrations/postgresql/database.js';

// Extend Express Request interface
interface AuthenticatedRequest extends Request {
  user?: any;
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await DatabaseService.findOne('users', { where: { id: decoded.userId } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await DatabaseService.findOne('users', { where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const session = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      access_token: token
    };

    res.json({ session });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await DatabaseService.findOne('users', { where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await DatabaseService.insert('users', {
      email,
      password_hash: passwordHash,
      role: 'user'
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/signout', authenticateToken, (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ message: 'Signed out successfully' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // In a real app, you would send a reset email
    // For now, just return success
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin check endpoints
app.get('/api/auth/admin/check/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await DatabaseService.findOne('users', { where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAdmin = user.role === 'admin' || user.role === 'superadmin';
    res.json({ isAdmin });
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auth/admin/super/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await DatabaseService.findOne('users', { where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isSuperAdmin = user.role === 'superadmin';
    res.json({ isSuperAdmin });
  } catch (error) {
    console.error('Super admin check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User routes
app.get('/api/users/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json(req.user);
});

// Company routes
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await DatabaseService.findAll('companies');
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const company = await DatabaseService.findById('companies', id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Network routes
app.get('/api/network', async (req, res) => {
  try {
    const companies = await DatabaseService.findAll('companies', { where: { status: 'approved' } });
    res.json(companies);
  } catch (error) {
    console.error('Get network error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Funding routes
app.get('/api/funding', async (req, res) => {
  try {
    const opportunities = await DatabaseService.findAll('funding_opportunities');
    res.json(opportunities);
  } catch (error) {
    console.error('Get funding error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forum routes
app.get('/api/forum', async (req, res) => {
  try {
    const posts = await DatabaseService.findAll('forum_posts');
    res.json(posts);
  } catch (error) {
    console.error('Get forum error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Events routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await DatabaseService.findAll('events');
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Messaging routes
app.get('/api/messaging', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = await DatabaseService.findAll('messages', { 
      where: { 
        recipient_id: req.user!.id 
      } 
    });
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin routes
app.get('/api/admin/stats', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin' && req.user!.role !== 'superadmin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalUsers = await DatabaseService.count('users');
    const totalCompanies = await DatabaseService.count('companies');
    const pendingCompanies = await DatabaseService.count('companies', { where: { status: 'pending' } });
    const approvedCompanies = await DatabaseService.count('companies', { where: { status: 'approved' } });

    res.json({
      totalUsers,
      totalCompanies,
      pendingCompanies,
      approvedCompanies
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/admin/users', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin' && req.user!.role !== 'superadmin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await DatabaseService.findAll('users');
    res.json(users);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
