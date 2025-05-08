
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PasswordChange = () => {
  const { t } = useTranslations();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error("Nywila mpya hazioani. Tafadhali jaribu tena.");
      setIsLoading(false);
      return;
    }
    
    // Here would be API call to change password
    setTimeout(() => {
      toast.success("Nywila imebadilishwa kwa mafanikio!");
      setIsLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('passwordChangeTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('passwordChangeTitle')}</h2>
          <p className="text-gray-500 text-center">{t('passwordChangeDesc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="current-password" className="block text-sm font-medium">
              Nywila ya Sasa
            </label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="new-password" className="block text-sm font-medium">
              Nywila Mpya
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium">
              Thibitisha Nywila Mpya
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••"
              className="w-full"
            />
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Inabadilisha..." : t('save')}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default PasswordChange;
