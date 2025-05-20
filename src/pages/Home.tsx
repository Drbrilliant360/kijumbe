
import TransactionsList from "@/components/home/TransactionsList";
import GroupsList from "@/components/home/GroupsList";
import AppLayout from "@/components/layout/AppLayout";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserGroups } from "@/hooks/useUserGroups";
import Loading from "@/components/ui/loading";
import { useState, useEffect } from "react";

const Home = () => {
  const { userId } = useUserProfile();
  const [isLoading, setIsLoading] = useState(true);
  
  // Wherever you're using the useUserGroups hook and rendering the GroupsList:
  const { groups, loading, error, refreshGroups } = useUserGroups(userId);

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
    <AppLayout>
      <div className="py-4 px-4">
        <GroupsList 
          groups={groups} 
          loading={loading} 
          error={error} 
          onRetry={refreshGroups} 
        />
        <TransactionsList transactions={[]} loading={false} />
      </div>
    </AppLayout>
  );
};

export default Home;
