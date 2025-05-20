
import { useState, useEffect } from "react";
import TransactionsList from "@/components/home/TransactionsList";
import GroupsList from "@/components/home/GroupsList";
import AppLayout from "@/components/layout/AppLayout";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserGroups } from "@/hooks/useUserGroups";
import Loading from "@/components/ui/loading";
import BalanceSummary from "@/components/home/BalanceSummary";
import QuickActions from "@/components/home/QuickActions";
import HomeHeader from "@/components/home/HomeHeader";

const Home = () => {
  const { userId } = useUserProfile();
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user groups with the useUserGroups hook
  const { groups, loading: groupsLoading, error, refreshGroups } = useUserGroups(userId);

  useEffect(() => {
    // Set a short timeout to prevent flashing loading states for quick responses
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="md" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout header={<HomeHeader />}>
      <div className="py-4 px-4 space-y-6">
        <BalanceSummary isLoading={groupsLoading} />
        <QuickActions />
        <GroupsList 
          groups={groups} 
          loading={groupsLoading} 
          error={error} 
          onRetry={refreshGroups} 
        />
        <TransactionsList transactions={[]} loading={false} />
      </div>
    </AppLayout>
  );
};

export default Home;
