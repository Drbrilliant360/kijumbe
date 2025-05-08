
import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/context/LanguageContext";
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
  const { language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(false);
  
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
    
    // Change language with a small delay for better UX
    setTimeout(() => {
      setLanguage(languageCode as "sw" | "en" | "fr");
      setIsLoading(false);
      
      const selectedLanguage = languages.find(l => l.code === languageCode);
      toast.success(`Lugha imebadilishwa kuwa ${selectedLanguage?.localName}!`);
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-left ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => !isLoading && handleLanguageChange(lang.code)}
              disabled={isLoading}
            >
              <div>
                <p className="font-medium dark:text-gray-200">{lang.localName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lang.name}</p>
              </div>
              
              {language === lang.code && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium mb-2 text-blue-800 dark:text-blue-300">Maelezo</h3>
          <p className="text-sm text-blue-700 dark:text-blue-200">
            Kubadilisha lugha kutabadilisha maandishi yote katika programu hii. Baadhi ya maudhui yanaweza kubaki
            katika lugha ya awali.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default LanguageSettings;
