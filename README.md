# Wealth Pioneers Network

A comprehensive platform for building and managing shared wealth initiatives, connecting organizations committed to equitable wealth distribution and inclusive decision-making.

## 🚀 Project Overview

The Wealth Pioneers Network is a modern web application that serves as a global hub for companies implementing shared wealth principles. It provides tools, resources, and a community for organizations committed to:

- **Shared Wealth Creation**: Giving stakeholders a genuine share in the value they create
- **Inclusive Decision-Making**: Embedding stakeholder voices into governance structures  
- **Value-Led Approach**: Ensuring clear social mission and mutual responsibilities

## ✨ Key Features

### 🎯 Core Functionality
- **Interactive Tools**: Calculator, Assessment, Simulator, and Configurator
- **Network Management**: Company profiles, partnerships, and impact tracking
- **Resource Hub**: Educational content, case studies, and best practices
- **Dashboard**: Comprehensive overview with metrics and activity tracking

### 🛠️ Enhanced Tools

#### Advanced Impact Calculator
- Industry-specific calculations with multipliers
- Environmental impact assessment
- Stakeholder satisfaction scoring
- ROI and payback period analysis
- Implementation recommendations

#### Readiness Assessment
- Comprehensive organizational evaluation
- Personalized recommendations
- Progress tracking
- Action planning

#### Governance Simulator
- Interactive scenario modeling
- Decision-making simulations
- Outcome predictions
- Best practice recommendations

#### Model Configurator
- Custom shared wealth model design
- Component selection and combination
- Implementation roadmap generation
- Risk assessment

### 📊 Dashboard Features
- **Real-time Metrics**: Network growth, impact scores, partnerships
- **Progress Tracking**: Visual indicators for goals and achievements
- **Activity Feed**: Latest updates from the network
- **Quick Access**: Direct links to all tools and resources

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: React Query + Context API
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/msalmanmunirmalik/wealth-pioneers-network.git
   cd wealth-pioneers-network
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Admin-specific components
│   └── *.tsx           # Main feature components
├── pages/              # Page components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── App.tsx            # Main application component
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **Color Palette**: Navy, Gold, Teal, Green, Orange
- **Typography**: Modern, readable fonts
- **Components**: Consistent UI patterns
- **Animations**: Smooth transitions and micro-interactions
- **Responsive Design**: Mobile-first approach

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Enhancements Made

### 1. Advanced Impact Calculator
- Added industry-specific multipliers
- Environmental impact calculations
- Stakeholder satisfaction scoring
- ROI and payback period analysis
- Tabbed interface for better UX

### 2. Comprehensive Dashboard
- Real-time metrics display
- Network progress tracking
- Activity feed
- Quick access to tools
- Responsive design

### 3. Enhanced Navigation
- Dashboard integration
- Improved mobile menu
- Better user experience

### 4. Interactive Tools Integration
- All tools now properly connected
- Consistent UI/UX across tools
- Better error handling

## 🔐 Authentication & Authorization

The application uses Supabase for authentication with:
- Email/password authentication
- Role-based access control
- Admin panel for administrators
- Secure session management

## 📊 Data Management

- **Supabase Database**: PostgreSQL with real-time subscriptions
- **File Storage**: Supabase Storage for assets
- **Caching**: React Query for efficient data fetching
- **State Management**: Context API for global state

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Future Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Advanced AI-powered recommendations

---

**Built with ❤️ for a more equitable future**
