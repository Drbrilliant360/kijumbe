
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ClearCache = () => {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClearCache = () => {
    setIsLoading(true);
    
    // Simulate clearing cache
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Data iliyohifadhiwa imefutwa!");
    }, 1500);
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('clearCacheTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Trash2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('clearCacheTitle')}</h2>
          <p className="text-gray-500 text-center">{t('clearCacheDesc')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 text-amber-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="font-bold text-lg">Tahadhari</h3>
          </div>
          
          <p className="mb-4 text-gray-700">
            Kufuta data iliyohifadhiwa kutaondoa:
          </p>
          
          <ul className="list-disc pl-5 mb-6 space-y-1 text-gray-700">
            <li>Data ya hapo awali iliyohifadhiwa</li>
            <li>Mipangilio ya programu</li>
            <li>Historia ya shughuli</li>
            <li>Takwimu zilizohifadhiwa</li>
          </ul>
          
          <p className="font-medium mb-6 text-gray-700">
            Hatua hii haiwezi kutenduliwa. Je, unataka kuendelea?
          </p>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => history.back()}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleClearCache}
              disabled={isLoading}
            >
              {isLoading ? "Inafuta..." : "Futa Data"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClearCache;
