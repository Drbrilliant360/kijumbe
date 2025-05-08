
import SettingsItem from "../settings-items/SettingsItem";
import { User, CreditCard } from "lucide-react";

const PersonalInfoSection = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-700 px-4">Maelezo Binafsi</h2>
      
      <SettingsItem
        icon={<User className="w-5 h-5 text-primary" />}
        title="Hariri Wasifu"
        description="Badilisha jina, barua pepe, na namba ya simu"
        to="/mpangilio/edit-profile"
      />

      <SettingsItem
        icon={<CreditCard className="w-5 h-5 text-primary" />}
        title="Akaunti za Benki"
        description="Simamia akaunti zako za benki"
        to="/mpangilio/bank-accounts"
      />
    </div>
  );
};

export default PersonalInfoSection;
