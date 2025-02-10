
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/auth" />;
  }
  
  return children;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  
  if (session) {
    return <Navigate to="/" />;
  }
  
  return children;
}

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Index />
        </PrivateRoute>
      }
    />
    <Route
      path="/auth"
      element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
