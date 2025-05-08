
import SettingsItem from "../settings-items/SettingsItem";
import SettingsItemInfo from "../settings-items/SettingsItemInfo";
import { RefreshCcw, Trash2 } from "lucide-react";

const AppInfoSection = () => {
  const appVersion = "1.0.0";
  
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-700 px-4">Jumbe na Usaidizi</h2>
      
      <SettingsItemInfo
        icon={<RefreshCcw className="w-5 h-5 text-primary" />}
        title="Toleo la Programu"
        description={`Toleo ${appVersion}`}
      />

      <SettingsItem
        icon={<Trash2 className="w-5 h-5 text-primary" />}
        title="Futa Kache/Data"
        description="Safisha data iliyohifadhiwa kwenye kifaa"
        to="/mpangilio/clear-cache"
        variant="destructive"
      />
    </div>
  );
};

export default AppInfoSection;
