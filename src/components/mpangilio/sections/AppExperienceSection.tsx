
import SettingsItem from "../settings-items/SettingsItem";
import SettingsToggleItem from "../settings-items/SettingsToggleItem";
import { Languages, PaintBucket } from "lucide-react";
import { useState } from "react";

const AppExperienceSection = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    // Theme implementation would go here
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-700 px-4">Uzoefu wa Programu</h2>
      
      <SettingsItem
        icon={<Languages className="w-5 h-5 text-primary" />}
        title="Lugha"
        description="Chagua lugha unayopendelea"
        to="/mpangilio/language"
      />

      <SettingsToggleItem
        icon={<PaintBucket className="w-5 h-5 text-primary" />}
        title="Mandhari Nyeusi"
        description="Badilisha muonekano wa programu"
        checked={darkMode}
        onCheckedChange={handleThemeToggle}
      />
    </div>
  );
};

export default AppExperienceSection;
