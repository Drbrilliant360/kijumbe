
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BalanceSummary from "@/components/home/BalanceSummary";
import QuickActions from "@/components/home/QuickActions";
import PaymentCard from "@/components/payments/PaymentCard";
import TransactionItem from "@/components/home/TransactionItem";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchGroups();
    fetchTransactions();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserName(profile?.full_name || profile?.username || 'User');
    } catch (error: any) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('status', 'active')
        .limit(3);

      if (error) throw error;
      setGroups(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load groups"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
    }
  };

  const Header = (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <span className="text-primary font-bold">{userName.charAt(0)}</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{t('greeting')}, {userName}</h2>
            <p className="text-gray-500 text-sm">Karibu Kijumbe App</p>
          </div>
        </div>
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );

  return (
    <AppLayout header={Header}>
      {/* Balance Summary */}
      <BalanceSummary 
        totalBalance={-1825000}
        contributions={1325000}
        payments={3150000}
        debt={20000}
        hasActive={groups.length > 0}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Groups */}
      {groups.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg">Vikundi Vyangu</h2>
            <button className="text-primary font-medium text-sm">
              {t('viewAll')} &gt;
            </button>
          </div>

          {groups.map(group => (
            <PaymentCard 
              key={group.id}
              title={group.name}
              amount={group.amount}
              dueDate={new Date(group.created_at).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
              dayNumber={7}
            />
          ))}
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Taarifa</h2>
          <button className="text-primary font-medium text-sm">
            {t('viewAll')} &gt;
          </button>
        </div>

        {transactions.map(transaction => (
          <TransactionItem 
            key={transaction.id}
            type={transaction.type}
            title={transaction.description || "Transaction"}
            description={transaction.group_id ? "Group Payment" : "Individual Payment"}
            amount={transaction.amount}
            date={new Date(transaction.created_at).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
            isPositive={transaction.type === 'deposit'}
          />
        ))}
      </div>
    </AppLayout>
  );
};

export default Home;
