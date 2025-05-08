
import SettingsItem from "../settings-items/SettingsItem";
import SettingsToggleItem from "../settings-items/SettingsToggleItem";
import { Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const AppExperienceSection = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 px-4">Uzoefu wa Programu</h2>
      
      <SettingsItem
        icon={<Languages className="w-5 h-5 text-primary" />}
        title="Lugha"
        description="Chagua lugha unayopendelea"
        to="/mpangilio/language"
      />

      <SettingsToggleItem
        icon={isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
        title="Mandhari Nyeusi"
        description="Badilisha muonekano wa programu"
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
      />
    </div>
  );
};

export default AppExperienceSection;
