
import { ArrowUpRight, Wallet, ArrowDownRight, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BalanceSummaryProps {
  isLoading?: boolean;
}

const BalanceSummary = ({ isLoading = false }: BalanceSummaryProps) => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [contributions, setContributions] = useState(0);
  const [payments, setPayments] = useState(0);
  const [debt, setDebt] = useState(0);
  const [hasActive, setHasActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
      currencyDisplay: 'narrowSymbol'
    }).format(amount).replace('TZS', '').trim();
  };

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch all contributions (deposits)
        const { data: contributionsData, error: contributionsError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'deposit');
          
        if (contributionsError) throw contributionsError;
        
        // Fetch all payments (withdrawals)
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'withdrawal');
          
        if (paymentsError) throw paymentsError;

        // Calculate total contributions
        const totalContributions = contributionsData?.reduce((sum, item) => sum + item.amount, 0) || 0;
        setContributions(totalContributions);
        
        // Calculate total payments
        const totalPayments = paymentsData?.reduce((sum, item) => sum + item.amount, 0) || 0;
        setPayments(totalPayments);
        
        // Calculate balance
        setTotalBalance(totalContributions - totalPayments);

        // Check if user has active groups
        const { count, error: groupError } = await supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (groupError) throw groupError;
        setHasActive(count !== null && count > 0);
        
        // To implement: fetch actual penalties (adhabu) from a future table or calculate from late payments
        // For now using a placeholder value
        setDebt(20000);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFinancialData();
  }, []);

  if (isLoading || loading) {
    return (
      <div className="bg-primary rounded-lg p-4 text-white">
        <div className="flex items-center justify-center h-48">
          <Circle className="animate-spin h-10 w-10 text-green-300" />
        </div>
      </div>
    );
  }

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
          <p className="font-bold mt-1">{hasActive ? "Mapya" : "Hakuna"}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
