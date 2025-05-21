
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { useState } from "react";

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
import Uliza from "./pages/Uliza";

// Profile Sub-pages
import PersonalInfo from "./pages/profile/PersonalInfo";
import Notifications from "./pages/profile/Notifications";
import Security from "./pages/profile/Security";
import Help from "./pages/profile/Help";
import About from "./pages/profile/About";

// Mpangilio Sub-pages
import PasswordChange from "./pages/mpangilio/PasswordChange";
import TwoFactorAuth from "./pages/mpangilio/TwoFactorAuth";
import BiometricLogin from "./pages/mpangilio/BiometricLogin";
import LogoutAllDevices from "./pages/mpangilio/LogoutAllDevices";
import ManageDevices from "./pages/mpangilio/ManageDevices";
import EditProfile from "./pages/mpangilio/EditProfile";
import BankAccounts from "./pages/mpangilio/BankAccounts";
import LanguageSettings from "./pages/mpangilio/LanguageSettings";
import ClearCache from "./pages/mpangilio/ClearCache";

const App = () => {
  // Create QueryClient with useState to ensure it's only created once
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // 1 minute
        cacheTime: 300000, // 5 minutes
        retry: 1, // Only retry once
      },
    },
  }));
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
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
                <Route path="/uliza" element={<Uliza />} />
                
                {/* Profile Sub-routes */}
                <Route path="/profile/personal" element={<PersonalInfo />} />
                <Route path="/profile/notifications" element={<Notifications />} />
                <Route path="/profile/security" element={<Security />} />
                <Route path="/profile/help" element={<Help />} />
                <Route path="/profile/about" element={<About />} />
                
                {/* Mpangilio Sub-routes */}
                <Route path="/mpangilio/password" element={<PasswordChange />} />
                <Route path="/mpangilio/two-factor" element={<TwoFactorAuth />} />
                <Route path="/mpangilio/biometric" element={<BiometricLogin />} />
                <Route path="/mpangilio/logout-all" element={<LogoutAllDevices />} />
                <Route path="/mpangilio/devices" element={<ManageDevices />} />
                <Route path="/mpangilio/edit-profile" element={<EditProfile />} />
                <Route path="/mpangilio/bank-accounts" element={<BankAccounts />} />
                <Route path="/mpangilio/language" element={<LanguageSettings />} />
                <Route path="/mpangilio/clear-cache" element={<ClearCache />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
