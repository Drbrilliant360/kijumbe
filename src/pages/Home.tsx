import TransactionsList from "@/components/home/TransactionsList";
import GroupsList from "@/components/home/GroupsList";
import AppLayout from "@/components/layout/AppLayout";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserGroups } from "@/hooks/useUserGroups";

const Home = () => {
  const { userId } = useUserProfile();
  
  // Wherever you're using the useUserGroups hook and rendering the GroupsList:
  const { groups, loading, error, refreshGroups } = useUserGroups(userId);

  return (
    <AppLayout>
      <div className="py-4 px-4">
        <GroupsList 
          groups={groups} 
          loading={loading} 
          error={error} 
          onRetry={refreshGroups} 
        />
        <TransactionsList transactions={[]} />
      </div>
    </AppLayout>
  );
};

export default Home;
