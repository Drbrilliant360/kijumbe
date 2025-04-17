
import { ArrowUpRight, Wallet, ArrowDownRight } from "lucide-react";

interface BalanceSummaryProps {
  totalBalance: number;
  contributions: number;
  payments: number;
  debt: number;
  hasActive: boolean;
}

const BalanceSummary = ({
  totalBalance,
  contributions,
  payments,
  debt,
  hasActive
}: BalanceSummaryProps) => {
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
    <div className="bg-primary rounded-lg p-4 text-white">
      <div className="flex items-center mb-3">
        <div className="bg-white/20 rounded-full p-2 mr-3">
          <Wallet className="w-5 h-5" />
        </div>
        <span className="text-lg">Jumla ya Akiba</span>
        <button className="ml-auto bg-primary-light/20 text-white px-3 py-1 rounded-full text-xs flex items-center">
          Tazama <ArrowUpRight className="w-3 h-3 ml-1" />
        </button>
      </div>
      
      <div className="text-3xl font-bold mb-3">
        TZS {formatCurrency(totalBalance)}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center">
            <ArrowDownRight className="w-4 h-4 text-green-300 bg-green-400/20 rounded-full p-0.5 mr-2" />
            <span className="text-sm text-gray-100">Michango</span>
          </div>
          <p className="font-bold mt-1">TZS {formatCurrency(contributions)}</p>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center">
            <ArrowUpRight className="w-4 h-4 text-orange-300 bg-orange-400/20 rounded-full p-0.5 mr-2" />
            <span className="text-sm text-gray-100">Malipo</span>
          </div>
          <p className="font-bold mt-1">TZS {formatCurrency(payments)}</p>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center">
            <ArrowUpRight className="w-4 h-4 text-red-300 bg-red-400/20 rounded-full p-0.5 mr-2" />
            <span className="text-sm text-gray-100">Adhabu</span>
          </div>
          <p className="font-bold mt-1">TZS {formatCurrency(debt)}</p>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center">
            <ArrowDownRight className="w-4 h-4 text-blue-300 bg-blue-400/20 rounded-full p-0.5 mr-2" />
            <span className="text-sm text-gray-100">Yajayo</span>
          </div>
          <p className="font-bold mt-1">{hasActive ? "TZS 0" : "Hakuna"}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
