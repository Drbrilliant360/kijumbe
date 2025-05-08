
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  variant?: "default" | "destructive";
}

const SettingsItem = ({ 
  icon, 
  title, 
  description, 
  to,
  variant = "default" 
}: SettingsItemProps) => {
  return (
    <Link to={to} className="block">
      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-secondary rounded-full p-3 mr-4">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${variant === "destructive" ? "text-red-600" : ""}`}>
            {title}
          </h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
};

export default SettingsItem;
