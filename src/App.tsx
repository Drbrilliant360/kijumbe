
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Verification from "./pages/Verification";
import Home from "./pages/Home";
import Malipo from "./pages/Malipo";
import Vikundi from "./pages/Vikundi";
import Profile from "./pages/Profile";
import Mpangilio from "./pages/Mpangilio";
import NotFound from "./pages/NotFound";
import GroupDashboard from "./pages/GroupDashboard";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verification" element={<Verification />} />
            
            {/* Protected Routes (would add auth check in a real app) */}
            <Route path="/home" element={<Home />} />
            <Route path="/malipo" element={<Malipo />} />
            <Route path="/vikundi" element={<Vikundi />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mpangilio" element={<Mpangilio />} />
            <Route path="/vikundi/:id" element={<GroupDashboard />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
