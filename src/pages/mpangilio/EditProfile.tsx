
import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";

const EditProfile = () => {
  const { t } = useTranslations();
  const { userName, userEmail, loading } = useUserProfile();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!loading && userName) {
      setFullName(userName);
      setEmail(userEmail || "");
      setPhone("+255 678 123456"); // Mock data
    }
  }, [loading, userName, userEmail]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Taarifa zako zimesasishwa!");
      setIsLoading(false);
    }, 1000);
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('editProfileTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('editProfileTitle')}</h2>
          <p className="text-gray-500 text-center">{t('editProfileDesc')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-2">
                <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${fullName}`} alt={fullName} />
                <AvatarFallback>{fullName?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Badilisha Picha
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium">
                Jina Kamili
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jina kamili"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Barua Pepe
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="barua@mfano.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">
                Namba ya Simu
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 XXX XXX XXX"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Inahifadhi..." : t('save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditProfile;
