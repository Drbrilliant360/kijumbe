
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const TwoFactorAuth = () => {
  const { t } = useTranslations();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggle = (checked: boolean) => {
    if (checked) {
      setIsActivating(true);
    } else {
      // Disable 2FA
      setIsLoading(true);
      setTimeout(() => {
        setIsEnabled(false);
        setIsLoading(false);
        toast.success("Uthibitishaji wa hatua mbili umezimwa!");
      }, 1000);
    }
  };
  
  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsEnabled(true);
      setIsActivating(false);
      setIsLoading(false);
      setVerificationCode("");
      toast.success("Uthibitishaji wa hatua mbili umewashwa!");
    }, 1000);
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('twoFactorTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('twoFactorTitle')}</h2>
          <p className="text-gray-500 text-center">{t('twoFactorDesc')}</p>
        </div>

        {isActivating ? (
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Washa Uthibitishaji wa Hatua Mbili</h3>
            <p className="mb-4 text-sm text-gray-600">
              Tumetuma msimbo wa uthibitishaji kwenye namba yako ya simu. Tafadhali ingiza msimbo huo hapa chini.
            </p>
            
            <form onSubmit={handleActivate} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="verification-code" className="block text-sm font-medium">
                  Msimbo wa Uthibitishaji
                </label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  placeholder="000000"
                  className="w-full text-center text-xl letter-spacing-wide"
                  maxLength={6}
                />
              </div>
              
              <div className="pt-2 flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full" 
                  onClick={() => setIsActivating(false)}
                  disabled={isLoading}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || verificationCode.length < 6}
                >
                  {isLoading ? "Inawasha..." : t('confirm')}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Uthibitishaji wa Hatua Mbili</h3>
                <p className="text-gray-500 text-sm">
                  {isEnabled ? "Uthibitishaji wa hatua mbili umewashwa" : "Washa uthibitishaji wa hatua mbili"}
                </p>
              </div>
              <Switch 
                checked={isEnabled} 
                onCheckedChange={handleToggle}
                disabled={isLoading}
              />
            </div>
            
            {isEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Uthibitishaji wa hatua mbili umewashwa. Utahitaji kuingiza msimbo wa uthibitishaji kila unapoingia kwenye akaunti.
                </p>
                <Button variant="outline" size="sm" onClick={() => handleToggle(false)}>
                  Zima Uthibitishaji wa Hatua Mbili
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium mb-2 text-yellow-800">Maelezo ya Usalama</h3>
          <p className="text-sm text-yellow-700">
            Uthibitishaji wa hatua mbili unaongeza usalama wa akaunti yako. Hata kama mtu atapata nywila yako, 
            hataweza kuingia bila kupata msimbo wa uthibitishaji.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default TwoFactorAuth;
