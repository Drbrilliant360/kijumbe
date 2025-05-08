
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Languages, ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Language {
  code: string;
  name: string;
  localName: string;
}

const LanguageSettings = () => {
  const { t } = useTranslations();
  const [currentLanguage, setCurrentLanguage] = useState("sw");
  const [isLoading, setIsLoading] = useState(false);
  
  const languages: Language[] = [
    {
      code: "sw",
      name: "Swahili",
      localName: "Kiswahili"
    },
    {
      code: "en",
      name: "English",
      localName: "English"
    },
    {
      code: "fr",
      name: "French",
      localName: "Français"
    }
  ];
  
  const handleLanguageChange = (languageCode: string) => {
    setIsLoading(true);
    
    // Simulate changing language
    setTimeout(() => {
      setCurrentLanguage(languageCode);
      setIsLoading(false);
      
      const language = languages.find(l => l.code === languageCode);
      toast.success(`Lugha imebadilishwa kuwa ${language?.localName}!`);
    }, 500);
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('languageTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Languages className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('languageTitle')}</h2>
          <p className="text-gray-500 text-center">{t('languageDesc')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {languages.map(language => (
            <button
              key={language.code}
              className={`w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 text-left ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => !isLoading && handleLanguageChange(language.code)}
              disabled={isLoading}
            >
              <div>
                <p className="font-medium">{language.localName}</p>
                <p className="text-sm text-gray-500">{language.name}</p>
              </div>
              
              {currentLanguage === language.code && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium mb-2 text-blue-800">Maelezo</h3>
          <p className="text-sm text-blue-700">
            Kubadilisha lugha kutabadilisha maandishi yote katika programu hii. Baadhi ya maudhui yanaweza kubaki
            katika lugha ya awali.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default LanguageSettings;
