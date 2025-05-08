
import { Switch } from "@/components/ui/switch";

interface SettingsToggleItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const SettingsToggleItem = ({ 
  icon, 
  title, 
  description, 
  checked, 
  onCheckedChange 
}: SettingsToggleItemProps) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="bg-secondary rounded-full p-3 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};

export default SettingsToggleItem;
