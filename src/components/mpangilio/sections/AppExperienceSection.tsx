
import SettingsItem from "../settings-items/SettingsItem";
import SettingsToggleItem from "../settings-items/SettingsToggleItem";
import SettingsItemInfo from "../settings-items/SettingsItemInfo";
import { Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/use-translations";

const AppExperienceSection = () => {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  const isDarkMode = theme === 'dark';

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 px-4">{t("languageTitle")}</h2>
      
      <SettingsItem
        icon={<Languages className="w-5 h-5 text-primary" />}
        title={t("languageTitle")}
        description={t("languageDesc")}
        to="/mpangilio/language"
      />

      <SettingsToggleItem
        icon={isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
        title={t("themeTitle")}
        description={t("themeDesc")}
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
      />
      
      <SettingsItemInfo
        icon={<Languages className="w-5 h-5 text-primary" />}
        title={`${t("languageTitle")}: ${language === 'sw' ? 'Kiswahili' : language === 'en' ? 'English' : 'Français'}`}
        description={`${t("languageTitle")} ${language === 'sw' ? 'ya sasa' : language === 'en' ? 'currently set to' : 'actuellement défini à'}`}
      />
    </div>
  );
};

export default AppExperienceSection;
