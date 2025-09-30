import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import LeftSidebar from "@/components/LeftSidebar";
import PrivateRoute from "@/components/PrivateRoute";
import { Suspense, lazy, useState } from "react";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Model = lazy(() => import("@/pages/Model"));
const Network = lazy(() => import("@/pages/Network"));
const Resources = lazy(() => import("@/pages/Resources"));

const Companies = lazy(() => import("@/pages/Companies"));
const Calculator = lazy(() => import("@/pages/Calculator"));
const Assessment = lazy(() => import("@/pages/Assessment"));
const Simulator = lazy(() => import("@/pages/Simulator"));
const Configurator = lazy(() => import("@/pages/Configurator"));

const Onboarding = lazy(() => import('./pages/Onboarding'));
const CollaborationHub = lazy(() => import('./pages/CollaborationHub'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const TestDashboard = lazy(() => import('./pages/TestDashboard'));
const MyCompanies = lazy(() => import('./pages/MyCompanies'));
const DashboardResources = lazy(() => import('./pages/DashboardResources'));
const DashboardForum = lazy(() => import('./pages/DashboardForum'));
const NewsAndUpdates = lazy(() => import('./pages/NewsAndUpdates'));
const DashboardEvents = lazy(() => import('./pages/DashboardEvents'));
const SharedWealthModel = lazy(() => import('./pages/SharedWealthModel'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const WealthAnalyzer = lazy(() => import('./pages/WealthAnalyzer'));
const CommunicationOptimizer = lazy(() => import('./pages/CommunicationOptimizer'));
const ValuesAssessment = lazy(() => import('./pages/ValuesAssessment'));
const StakeholderMapping = lazy(() => import('./pages/StakeholderMapping'));
const DecisionFramework = lazy(() => import('./pages/DecisionFramework'));
const BusinessCanvas = lazy(() => import('./pages/BusinessCanvas'));
const FundingPlatform = lazy(() => import('./pages/FundingPlatform'));
const MessagingSystem = lazy(() => import('./pages/MessagingSystem'));
const IPSimulator = lazy(() => import('./pages/IPSimulator'));
const Tools = lazy(() => import('./pages/Tools'));
const Impact = lazy(() => import('./pages/Impact'));
const ImpactAnalytics = lazy(() => import('./pages/ImpactAnalytics'));
const Admin = lazy(() => import('./pages/Admin'));
const Auth = lazy(() => import('./pages/Auth'));

// New Social Features Pages
const SocialDashboard = lazy(() => import('./pages/SocialDashboard'));
const Messaging = lazy(() => import('./pages/Messaging'));
const FileManager = lazy(() => import('./pages/FileManager'));
const CompanyManagement = lazy(() => import('./pages/CompanyManagement'));

// Error Boundary component
const ErrorBoundary = ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in component:', error);
    return <>{fallback}</>;
  }
};

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Layout component for authenticated users with sidebar ONLY (no header)
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('user-dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'user-dashboard':
        return <UserDashboard />;
      case 'news-updates':
        return <NewsAndUpdates />;
      case 'network':
        return <Network />;
      case 'funding-platform':
        return <FundingPlatform />;
      case 'business-canvas':
        return <BusinessCanvas />;
      case 'tools-learning':
        return <Resources />; // Maps to Tools & Learning
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen bg-gray-50">
        <LeftSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

// Layout component for company management page (separate from dashboard)
const CompanyManagementLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen bg-gray-50">
        <LeftSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeTab="company-management"
          onTabChange={() => {}} // No tab switching in company management
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

// Layout component for public pages (no header)
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <main>{children}</main>
  </div>
);

// Layout component for landing page (no header)
const LandingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <main>{children}</main>
  </div>
);

function App() {
  console.log('App component rendering');
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary fallback={<div>Something went wrong. Check console for errors.</div>}>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                {/* Public Routes - Always show Header */}
                <Route path="/" element={
                  <LandingLayout>
                    <Index />
                  </LandingLayout>
                } />
                  <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={
                  <PrivateRoute requireAdmin={true}>
                    <Admin />
                  </PrivateRoute>
                } />

                <Route path="/about" element={
                  <LandingLayout>
                    <About />
                  </LandingLayout>
                } />
                <Route path="/model" element={
                  <LandingLayout>
                    <Model />
                  </LandingLayout>
                } />
                <Route path="/resources" element={
                  <LandingLayout>
                    <Resources />
                  </LandingLayout>
                } />
                <Route path="/onboarding" element={
                  <PublicLayout>
                    <Onboarding />
                  </PublicLayout>
                } />
                <Route path="/collaboration-hub" element={
                  <LandingLayout>
                    <CollaborationHub />
                  </LandingLayout>
                } />

                {/* Interactive Tools & Learning - Always show Header */}
                <Route path="/calculator" element={
                  <PublicLayout>
                    <Calculator />
                  </PublicLayout>
                } />
                <Route path="/assessment" element={
                  <PublicLayout>
                    <Assessment />
                  </PublicLayout>
                } />
                <Route path="/simulator" element={
                  <PublicLayout>
                    <Simulator />
                  </PublicLayout>
                } />
                <Route path="/configurator" element={
                  <PublicLayout>
                    <Configurator />
                  </PublicLayout>
                } />
                <Route path="/wealth-analyzer" element={
                  <PublicLayout>
                    <WealthAnalyzer />
                  </PublicLayout>
                } />
                <Route path="/communication-optimizer" element={
                  <PublicLayout>
                    <CommunicationOptimizer />
                  </PublicLayout>
                } />
                <Route path="/values-assessment" element={
                  <PublicLayout>
                    <ValuesAssessment />
                  </PublicLayout>
                } />
                <Route path="/stakeholder-mapping" element={
                  <PublicLayout>
                    <StakeholderMapping />
                  </PublicLayout>
                } />
                <Route path="/decision-framework" element={
                  <PublicLayout>
                    <DecisionFramework />
                  </PublicLayout>
                } />
                <Route path="/ip-simulator" element={
                  <PublicLayout>
                    <IPSimulator />
                  </PublicLayout>
                } />
                <Route path="/tools" element={
                  <PublicLayout>
                    <Tools />
                  </PublicLayout>
                } />
                <Route path="/impact" element={
                  <PublicLayout>
                    <Impact />
                  </PublicLayout>
                } />
                <Route path="/impact-analytics" element={
                  <PublicLayout>
                    <ImpactAnalytics />
                  </PublicLayout>
                } />

                {/* NEW ENHANCEMENT FEATURES - Always show Header */}
                <Route path="/business-canvas" element={
                  <PublicLayout>
                    <BusinessCanvas />
                  </PublicLayout>
                } />
                <Route path="/funding-platform" element={
                  <PublicLayout>
                    <FundingPlatform />
                  </PublicLayout>
                } />
                <Route path="/messaging" element={
                  <PublicLayout>
                    <MessagingSystem />
                  </PublicLayout>
                } />
                
                {/* Social Features Routes */}
                <Route path="/social-dashboard" element={
                  <PublicLayout>
                    <SocialDashboard />
                  </PublicLayout>
                } />
                <Route path="/realtime-messaging" element={
                  <PublicLayout>
                    <Messaging />
                  </PublicLayout>
                } />
                <Route path="/file-manager" element={
                  <PublicLayout>
                    <FileManager />
                  </PublicLayout>
                } />
                <Route path="/news-updates" element={
                  <PublicLayout>
                    <NewsAndUpdates />
                  </PublicLayout>
                } />
                <Route path="/company/:companyId" element={
                  <PrivateRoute>
                    <CompanyManagementLayout>
                      <CompanyManagement />
                    </CompanyManagementLayout>
                  </PrivateRoute>
                } />
                <Route path="/network" element={
                  <PublicLayout>
                    <Network />
                  </PublicLayout>
                } />

                {/* Protected Routes - Require authentication with sidebar layout AND Header */}
                <Route path="/user-dashboard" element={
                  <PrivateRoute>
                    <AuthenticatedLayout>
                      <UserDashboard />
                    </AuthenticatedLayout>
                  </PrivateRoute>
                } />
                <Route path="/test-dashboard" element={
                  <PrivateRoute>
                    <AuthenticatedLayout>
                      <TestDashboard />
                    </AuthenticatedLayout>
                  </PrivateRoute>
                } />
                <Route path="/my-companies" element={
                  <PrivateRoute>
                    <AuthenticatedLayout>
                      <MyCompanies />
                    </AuthenticatedLayout>
                  </PrivateRoute>
                } />
                <Route path="/dashboard-resources" element={
                  <PrivateRoute>
                    <AuthenticatedLayout>
                      <DashboardResources />
                    </AuthenticatedLayout>
                  </PrivateRoute>
                } />
                <Route path="/forum" element={
                  <PrivateRoute>
                    <AuthenticatedLayout>
                      <DashboardForum />
                    </AuthenticatedLayout>
                  </PrivateRoute>
                } />
                <Route path="/events" element={
                  <PrivateRoute>
                    <AuthenticatedLayout>
                      <DashboardEvents />
                    </AuthenticatedLayout>
                  </PrivateRoute>
                } />
                <Route path="/shared-wealth-model" element={
                  <PublicLayout>
                    <SharedWealthModel />
                  </PublicLayout>
                } />
                <Route path="/about-us" element={
                  <PublicLayout>
                    <AboutUs />
                  </PublicLayout>
                } />
                <Route path="/companies" element={
                  <PrivateRoute>
                    <AuthenticatedLayout>
                      <Companies />
                    </AuthenticatedLayout>
                  </PrivateRoute>
                } />

                {/* Admin Route */}
                <Route path="/admin" element={
                  <PrivateRoute requireAdmin={true}>
                    <Admin />
                  </PrivateRoute>
                } />

                </Routes>
              </Suspense>
            </ErrorBoundary>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
}

export default App;
