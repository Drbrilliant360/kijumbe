
import { translations } from "@/utils/translations";

export const useTranslations = () => {
  const t = (key: keyof typeof translations): string => {
    return translations[key] || key;
  };

  return { t };
};
