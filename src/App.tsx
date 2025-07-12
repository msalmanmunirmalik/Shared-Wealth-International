import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Model from "./pages/Model";
import Network from "./pages/Network";
import Partnerships from "./pages/Partnerships";
import Impact from "./pages/Impact";
import Services from "./pages/Services";
import Resources from "./pages/Resources";
import Assessment from "./pages/Assessment";
import Calculator from "./pages/Calculator";
import Simulator from "./pages/Simulator";
import Configurator from "./pages/Configurator";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/model" element={<Model />} />
            <Route path="/network" element={<Network />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/configurator" element={<Configurator />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
