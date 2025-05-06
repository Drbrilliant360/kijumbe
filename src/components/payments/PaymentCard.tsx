
import { Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentCardProps {
  title: string;
  amount: number;
  dueDate: string;
  dayNumber: number;
  status?: string;
  onPay?: () => void;
}

const PaymentCard = ({ title, amount, dueDate, dayNumber, status = "pending", onPay }: PaymentCardProps) => {
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
      currencyDisplay: 'narrowSymbol'
    }).format(amount).replace('TZS', '').trim();
  };

  const isCompleted = status === 'completed';

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm mb-4 border ${isCompleted ? 'border-green-100' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-xl">{title}</h3>
        {dayNumber > 0 && !isCompleted ? (
          <div className="bg-secondary px-2 py-1 rounded-full flex items-center text-xs">
            <Clock className="w-3 h-3 mr-1" />
            <span>Siku {dayNumber}</span>
          </div>
        ) : (
          <div className={`px-2 py-1 rounded-full flex items-center text-xs ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCompleted ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <X className="w-3 h-3 mr-1" />
                <span>Overdue</span>
              </>
            )}
          </div>
        )}
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
      
      {onPay && !isCompleted && (
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white py-5"
          onClick={onPay}
        >
          Lipa Sasa
        </Button>
      )}
      
      {isCompleted && (
        <div className="flex items-center justify-center p-2 bg-green-50 rounded-md text-green-800">
          <Check className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Payment Completed</span>
        </div>
      )}
    </div>
  );
};

export default PaymentCard;
