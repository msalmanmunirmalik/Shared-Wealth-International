import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Model from "@/pages/Model";
import Network from "@/pages/Network";
import Resources from "@/pages/Resources";
import Auth from "@/pages/Auth";
import Dashboard from "@/components/Dashboard";
import Profile from "@/pages/Profile";
import Companies from "@/pages/Companies";
import Calculator from "@/pages/Calculator";
import Assessment from "@/pages/Assessment";
import Simulator from "@/pages/Simulator";
import Configurator from "@/pages/Configurator";
import Admin from "@/pages/Admin";
import PrivateRoute from "@/components/PrivateRoute";
import KnowledgeHub from './pages/KnowledgeHub';
import Onboarding from './pages/Onboarding';
import CollaborationHub from './pages/CollaborationHub';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Router>
          <div className="min-h-screen bg-background">
            <Header />
            <main>
          <Routes>
                {/* Public Routes */}
            <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/model" element={<Model />} />
            <Route path="/network" element={<Network />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/knowledge-hub" element={<KnowledgeHub />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/collaboration-hub" element={<CollaborationHub />} />
                
                {/* Interactive Tools */}
                <Route path="/calculator" element={<Calculator />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/configurator" element={<Configurator />} />
                
                {/* Protected Routes - Require authentication */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
