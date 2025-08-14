import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - loading:', loading);
  console.log('PrivateRoute - user exists:', !!user);

  if (loading) {
    console.log('PrivateRoute - showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <CardTitle className="text-blue-900 text-xl">Verifying Access</CardTitle>
            <CardDescription className="text-blue-600 text-base">
              Please wait while we verify your authentication...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) {
    console.log('PrivateRoute - no user, redirecting to auth');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-blue-900 text-xl">Access Required</CardTitle>
            <CardDescription className="text-blue-600 text-base">
              You need to be signed in to access this page. Please sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Navigate to="/auth" replace />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('PrivateRoute - user authenticated, showing children');
  return <>{children}</>;
};

export default PrivateRoute; 