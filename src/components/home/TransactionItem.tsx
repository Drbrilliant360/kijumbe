
import { ArrowDown, ArrowUp, Users } from "lucide-react";

interface TransactionItemProps {
  type: "deposit" | "withdrawal" | "group";
  title: string;
  description: string;
  amount: number;
  date: string;
  isPositive?: boolean;
}

const TransactionItem = ({
  type,
  title,
  description,
  amount,
  date,
  isPositive = true,
}: TransactionItemProps) => {
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
      currencyDisplay: 'narrowSymbol'
    }).format(amount).replace('TZS', '').trim();
  };

  const getIcon = () => {
    const bgColor = type === "deposit" || isPositive
      ? "bg-green-100"
      : type === "withdrawal"
      ? "bg-red-100"
      : "bg-gray-100";
    
    const iconColor = type === "deposit" || isPositive
      ? "text-green-500"
      : type === "withdrawal"
      ? "text-red-500"
      : "text-gray-500";

    if (type === "deposit") {
      return (
        <div className={`p-2 rounded-full ${bgColor}`}>
          <ArrowDown className={`w-5 h-5 ${iconColor}`} />
        </div>
      );
    } else if (type === "withdrawal") {
      return (
        <div className={`p-2 rounded-full ${bgColor}`}>
          <ArrowUp className={`w-5 h-5 ${iconColor}`} />
        </div>
      );
    } else {
      return (
        <div className={`p-2 rounded-full ${bgColor}`}>
          <Users className={`w-5 h-5 ${iconColor}`} />
        </div>
      );
    }
  };

  return (
    <div className="flex items-center py-3 border-b border-gray-100">
      {getIcon()}
      
      <div className="ml-3 flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      
      <div className="text-right">
        <p className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '' : '-'}TZS {formatCurrency(amount)}
        </p>
        <p className="text-gray-500 text-xs">{date}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
