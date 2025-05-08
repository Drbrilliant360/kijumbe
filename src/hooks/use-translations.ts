
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/utils/translations";

export const useTranslations = () => {
  const { language } = useLanguage();

  const t = (key: keyof typeof translations): string => {
    // If language is not Swahili and we have a translation for the selected language
    if (language !== "sw" && translations[key + "_" + language]) {
      return translations[key + "_" + language] as string;
    }
    
    // Default to Swahili translation
    return translations[key] || key;
  };

  return { t };
};
