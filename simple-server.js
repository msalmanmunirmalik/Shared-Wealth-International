import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Basic API routes for testing
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mock content API endpoint
app.get('/api/content', (req, res) => {
  const mockContent = [
    {
      id: "1",
      company_id: "comp-1",
      author_id: "user-1",
      title: "Shared Wealth Network Launches New Partnership Program",
      content: "We're excited to announce our new partnership program that will help companies collaborate more effectively on sustainable business practices.",
      post_type: "announcement",
      tags: ["partnership", "sustainability", "collaboration"],
      media_urls: [],
      reactions: { like: 45, love: 12, share: 8 },
      comments_count: 23,
      shares_count: 15,
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_name: "Shared Wealth International",
      company_logo: "/placeholder.svg",
      company_sector: "Technology",
      first_name: "John",
      last_name: "Smith",
      author_email: "john@sharedwealth.com"
    },
    {
      id: "2",
      company_id: "comp-2",
      author_id: "user-2",
      title: "ESG Reporting Best Practices for 2024",
      content: "As we move into 2024, here are the key ESG reporting practices that companies should adopt to meet evolving regulatory requirements.",
      post_type: "news",
      tags: ["ESG", "reporting", "compliance"],
      media_urls: [],
      reactions: { like: 32, love: 8, share: 12 },
      comments_count: 18,
      shares_count: 9,
      is_published: true,
      published_at: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      company_name: "GreenTech Solutions",
      company_logo: "/placeholder.svg",
      company_sector: "Environmental",
      first_name: "Sarah",
      last_name: "Johnson",
      author_email: "sarah@greentech.com"
    }
  ];

  res.json({
    success: true,
    data: mockContent,
    total: mockContent.length,
    has_more: false
  });
});

// Mock social API endpoints
app.get('/api/social/reactions/:contentId', (req, res) => {
  res.json({
    success: true,
    data: {
      like: 45,
      love: 12,
      share: 8
    }
  });
});

app.post('/api/social/reactions', (req, res) => {
  res.json({
    success: true,
    message: 'Reaction added successfully'
  });
});

// Mock user API endpoints
app.get('/api/users/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: "user-1",
      email: "demo@sharedwealth.com",
      first_name: "Demo",
      last_name: "User",
      role: "user"
    }
  });
});

// Catch all handler - serve React app for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend available at http://localhost:${PORT}`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
});
