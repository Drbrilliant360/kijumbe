
import { Circle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import BalanceSummary from "@/components/home/BalanceSummary";
import QuickActions from "@/components/home/QuickActions";
import HomeHeader from "@/components/home/HomeHeader";
import GroupsList from "@/components/home/GroupsList";
import TransactionsList from "@/components/home/TransactionsList";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserGroups } from "@/hooks/useUserGroups";
import { useUserTransactions } from "@/hooks/useUserTransactions";

const Home = () => {
  const { userName = "", loading: userLoading, userId } = useUserProfile();
  const { groups, loading: groupsLoading } = useUserGroups(userId);
  const { transactions, loading: transactionsLoading } = useUserTransactions(userId);
  
  const isLoading = userLoading || groupsLoading || transactionsLoading;

  const Header = (
    <HomeHeader userName={userName || ""} isLoading={userLoading} />
  );

  if (isLoading) {
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
      <GroupsList groups={groups} />

      {/* Transaction History */}
      <TransactionsList transactions={transactions} />
    </AppLayout>
  );
};

export default Home;
