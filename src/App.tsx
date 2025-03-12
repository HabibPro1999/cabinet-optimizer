
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

// Pages
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Inventory from "./pages/Inventory";
import SignIn from "./pages/SignIn";
import PatientDetails from "@/pages/PatientDetails";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

// Create a component that handles the initial redirect
const InitialRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Navigate to={user ? "/dashboard" : "/"} replace />;
};

// Main routes component with auth protection
const AppRoutes = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!user ? <SignIn /> : <Navigate to="/dashboard" replace />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Index />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:patientId" element={<PatientDetails />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/inventory" element={<Inventory />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toaster />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
