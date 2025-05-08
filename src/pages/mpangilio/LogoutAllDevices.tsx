
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LogoutAllDevices = () => {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogoutAll = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Umetoka kwenye vifaa vyote!");
      setIsLoading(false);
      navigate('/mpangilio');
    }, 1500);
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('logoutAllTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <LogOut className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('logoutAllTitle')}</h2>
          <p className="text-gray-500 text-center">{t('logoutAllDesc')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 text-amber-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="font-bold text-lg">Tahadhari</h3>
          </div>
          
          <p className="mb-6 text-gray-700">
            Kwa kufanya hivi, akaunti yako itafungwa kwenye vifaa vyote vingine vilivyokuwa vimeingia, isipokuwa kifaa hiki unachotumia sasa.
          </p>
          
          <p className="font-medium mb-6 text-gray-700">
            Je, unataka kuendelea?
          </p>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/mpangilio')}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogoutAll}
              disabled={isLoading}
            >
              {isLoading ? "Inatoka..." : "Toka Kwenye Vifaa Vyote"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LogoutAllDevices;
