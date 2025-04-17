
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentCardProps {
  title: string;
  amount: number;
  dueDate: string;
  dayNumber: number;
}

const PaymentCard = ({ title, amount, dueDate, dayNumber }: PaymentCardProps) => {
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
        <h3 className="font-bold text-xl">{title}</h3>
        <div className="bg-secondary px-2 py-1 rounded-full flex items-center text-xs">
          <Clock className="w-3 h-3 mr-1" />
          <span>Siku {dayNumber}</span>
        </div>
      </div>
      
      <div className="flex mb-2 text-gray-500">
        <div className="w-1/2">
          <p className="text-sm">Kiasi cha Mchango:</p>
          <p className="text-xl font-bold text-black">TZS {formatCurrency(amount)}</p>
        </div>
        <div className="w-1/2">
          <p className="text-sm">Tarehe ya Mwisho:</p>
          <p className="text-lg font-medium">{dueDate}</p>
        </div>
      </div>
      
      <Button className="w-full bg-primary hover:bg-primary/90 text-white py-5">
        Lipa Sasa
      </Button>
    </div>
  );
};

export default PaymentCard;
