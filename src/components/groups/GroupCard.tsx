
import { DollarSign, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GroupCardProps {
  title: string;
  description: string;
  amount: number;
  members: string;
  progress: number;
}

const GroupCard = ({ title, description, amount, members, progress }: GroupCardProps) => {
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
      currencyDisplay: 'narrowSymbol'
    }).format(amount).replace('TZS', '').trim();
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-xl">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <Badge variant="outline" className="bg-secondary text-primary">
          Hai
        </Badge>
      </div>
      
      <div className="flex items-center mt-3 mb-2">
        <div className="flex items-center mr-6">
          <DollarSign className="text-gray-500 w-4 h-4 mr-1" />
          <span className="text-sm">Mchango</span>
        </div>
        <div className="flex items-center">
          <Users className="text-gray-500 w-4 h-4 mr-1" />
          <span className="text-sm">Wanachama</span>
        </div>
      </div>
      
      <div className="flex mb-3">
        <div className="w-1/2 pr-3">
          <p className="font-bold">TZS {formatCurrency(amount)}</p>
        </div>
        <div className="w-1/2">
          <p className="font-bold">{members}</p>
        </div>
      </div>
      
      <div className="mb-1 flex justify-between">
        <span className="text-gray-600 text-sm">Maendeleo</span>
        <span className="text-gray-900 font-medium">{progress}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GroupCard;
