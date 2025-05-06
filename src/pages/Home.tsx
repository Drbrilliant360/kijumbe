
import { Bell, Circle } from "lucide-react";
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

      // First, try to get the user's profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results case

      if (error && error.code !== 'PGRST116') {
        // If there's an error other than "no rows", throw it
        throw error;
      }

      if (profile) {
        // If profile exists, use it
        setUserName(profile?.full_name || profile?.username || 'User');
      } else {
        // If no profile exists, create one using user metadata
        const fullName = user.user_metadata?.full_name;
        const email = user.email;
        
        if (fullName) {
          // Use the user's metadata to extract a name
          setUserName(fullName);
          
          // Create a profile for this user
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: fullName,
              username: email?.split('@')[0] || 'user',
              email_verified: user.email_confirmed_at ? true : false
            });
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        } else {
          // Fallback to email or default
          setUserName(email?.split('@')[0] || 'User');
        }
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user profile"
      });
    }
  };

  const fetchGroups = async () => {
    try {
      // Simplify the query to avoid the recursion issue
      const { data, error } = await supabase
        .from('groups')
        .select('*') // Only select the group data, not the related members
        .eq('status', 'active')
        .limit(3);

      if (error) throw error;
      
      // Fetch group member counts separately
      if (data && data.length > 0) {
        const groupsWithMemberCounts = await Promise.all(
          data.map(async (group) => {
            const { count, error: countError } = await supabase
              .from('group_members')
              .select('id', { count: 'exact', head: true })
              .eq('group_id', group.id);
            
            return {
              ...group,
              memberCount: countError ? 0 : (count || 0)
            };
          })
        );
        setGroups(groupsWithMemberCounts);
      } else {
        setGroups([]);
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error);
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

      // Simplify the query to avoid potential recursion issues
      const { data, error } = await supabase
        .from('transactions')
        .select('id, amount, type, description, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load transactions"
      });
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
            <h2 className="font-bold text-lg">Habari {userName}</h2>
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

  if (loading) {
    return (
      <AppLayout header={Header}>
        <div className="flex items-center justify-center h-48">
          <Circle className="animate-spin h-10 w-10 text-green-500" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout header={Header}>
      {/* Balance Summary */}
      <BalanceSummary />

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

        {transactions.length > 0 ? (
          transactions.map(transaction => (
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
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No transactions found.
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Home;
