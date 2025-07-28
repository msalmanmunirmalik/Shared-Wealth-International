import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import PrivateRoute from "@/components/PrivateRoute";
import { Suspense, lazy } from "react";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Model = lazy(() => import("@/pages/Model"));
const Network = lazy(() => import("@/pages/Network"));
const Resources = lazy(() => import("@/pages/Resources"));
const Auth = lazy(() => import("@/pages/Auth"));
const Companies = lazy(() => import("@/pages/Companies"));
const Calculator = lazy(() => import("@/pages/Calculator"));
const Assessment = lazy(() => import("@/pages/Assessment"));
const Simulator = lazy(() => import("@/pages/Simulator"));
const Configurator = lazy(() => import("@/pages/Configurator"));
const Admin = lazy(() => import("@/pages/Admin"));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const ImpactMetrics = lazy(() => import('./pages/CollaborationHub'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const TestDashboard = lazy(() => import('./pages/TestDashboard'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const MyCompanies = lazy(() => import('./pages/MyCompanies'));
const DashboardResources = lazy(() => import('./pages/DashboardResources'));
const DashboardForum = lazy(() => import('./pages/DashboardForum'));
const DashboardEvents = lazy(() => import('./pages/DashboardEvents'));
const SharedWealthModel = lazy(() => import('./pages/SharedWealthModel'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const WealthAnalyzer = lazy(() => import('./pages/WealthAnalyzer'));
const CommunicationOptimizer = lazy(() => import('./pages/CommunicationOptimizer'));
const ValuesAssessment = lazy(() => import('./pages/ValuesAssessment'));
const StakeholderMapping = lazy(() => import('./pages/StakeholderMapping'));
const DecisionFramework = lazy(() => import('./pages/DecisionFramework'));
const IPSimulator = lazy(() => import('./pages/IPSimulator'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Reload Page
      </button>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Router>
          <div className="min-h-screen bg-background">
            <Header />
            <main>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/model" element={<Model />} />
                  <Route path="/network" element={<Network />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/collaboration-hub" element={<ImpactMetrics />} />
                  
                  {/* Interactive Tools */}
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/assessment" element={<Assessment />} />
                  <Route path="/simulator" element={<Simulator />} />
                  <Route path="/configurator" element={<Configurator />} />
                  
                  {/* Protected Routes - Require authentication */}
                  <Route path="/company-dashboard" element={<PrivateRoute><CompanyDashboard /></PrivateRoute>} />
                  <Route path="/test-dashboard" element={<PrivateRoute><TestDashboard /></PrivateRoute>} />
                  <Route path="/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
                  <Route path="/my-companies" element={<PrivateRoute><MyCompanies /></PrivateRoute>} />
                  <Route path="/resources" element={<PrivateRoute><DashboardResources /></PrivateRoute>} />
                  <Route path="/forum" element={<PrivateRoute><DashboardForum /></PrivateRoute>} />
                  <Route path="/events" element={<PrivateRoute><DashboardEvents /></PrivateRoute>} />
                  <Route path="/shared-wealth-model" element={<SharedWealthModel />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/wealth-analyzer" element={<WealthAnalyzer />} />
                  <Route path="/communication-optimizer" element={<CommunicationOptimizer />} />
                  <Route path="/values-assessment" element={<ValuesAssessment />} />
                  <Route path="/stakeholder-mapping" element={<StakeholderMapping />} />
                  <Route path="/decision-framework" element={<DecisionFramework />} />
                  <Route path="/ip-simulator" element={<IPSimulator />} />
                  <Route path="/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
                  <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
