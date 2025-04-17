
import { DollarSign, Users, UserPlus, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="mt-6 mb-4">
      <h2 className="font-bold text-lg mb-3">Hatua za Haraka</h2>
      <div className="grid grid-cols-4 gap-4">
        <ActionButton 
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          label="Lipa Mchango"
          bgColor="bg-green-50"
          to="/lipa-mchango"
        />
        
        <ActionButton 
          icon={<Users className="w-5 h-5 text-amber-500" />}
          label="Unda Kikundi"
          bgColor="bg-amber-50"
          to="/unda-kikundi"
        />
        
        <ActionButton 
          icon={<UserPlus className="w-5 h-5 text-blue-500" />}
          label="Jiunge na Kikundi"
          bgColor="bg-blue-50"
          to="/jiunge-kikundi"
        />
        
        <ActionButton 
          icon={<FileText className="w-5 h-5 text-teal-500" />}
          label="Risiti Zangu"
          bgColor="bg-teal-50"
          to="/risiti"
        />
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  to: string;
}

const ActionButton = ({ icon, label, bgColor, to }: ActionButtonProps) => {
  return (
    <Link to={to} className="flex flex-col items-center">
      <div className={`${bgColor} rounded-full p-3 mb-1`}>
        {icon}
      </div>
      <span className="text-xs text-center text-gray-700 max-w-[70px]">
        {label}
      </span>
    </Link>
  );
};

export default QuickActions;
