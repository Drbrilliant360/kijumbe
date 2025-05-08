
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Fingerprint, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const BiometricLogin = () => {
  const { t } = useTranslations();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggle = (checked: boolean) => {
    setIsLoading(true);
    
    // Simulate setting up biometric authentication
    setTimeout(() => {
      setIsEnabled(checked);
      setIsLoading(false);
      if (checked) {
        toast.success("Kipengele cha biometric kimewashwa!");
      } else {
        toast.success("Kipengele cha biometric kimezimwa!");
      }
    }, 1000);
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('biometricTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Fingerprint className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('biometricTitle')}</h2>
          <p className="text-gray-500 text-center">{t('biometricDesc')}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Kipengele cha Biometric</h3>
              <p className="text-gray-500 text-sm">
                {isEnabled ? "Ingia kwa kutumia alama za vidole au uso" : "Washa kipengele cha biometric"}
              </p>
            </div>
            <Switch 
              checked={isEnabled} 
              onCheckedChange={handleToggle}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-2">Vifaa Vilivyosajiliwa</h3>
            {isEnabled ? (
              <div className="py-2">
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">Simu ya Mkononi</p>
                    <p className="text-sm text-gray-500">Alama za vidole</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Kifaa kimeondolewa!")}>
                    Ondoa
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-2">
                Hakuna vifaa vilivyosajiliwa. Washa kipengele cha biometric kusajili kifaa chako.
              </p>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium mb-2 text-blue-800">Maelezo ya Kipengele</h3>
            <p className="text-sm text-blue-700">
              Kipengele cha biometric kinatumia teknolojia ya simu yako kuwezesha uingie bila kuingiza nywila. Hakikisha kifaa chako kimesajiliwa kukitumia.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BiometricLogin;
