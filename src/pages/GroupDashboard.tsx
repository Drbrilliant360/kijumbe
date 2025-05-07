
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupOverview from "@/components/groups/GroupOverview";
import GroupMembers from "@/components/groups/GroupMembers";
import GroupTransactions from "@/components/groups/GroupTransactions";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";

const GroupDashboard = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const fetchGroupDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the group details first
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();

      if (groupError) throw groupError;
      
      // Fetch members separately
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', id);
        
      if (membersError) throw membersError;
      
      // Fetch transactions separately
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('group_id', id);
        
      if (transactionsError) throw transactionsError;
      
      // Combine the data
      setGroup(groupData);
      setGroupMembers(membersData || []);
      setTransactions(transactionsData || []);
    } catch (error: any) {
      console.error("Error fetching group details:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGroupDetails();
    }
  }, [id]);

  const handleShare = async () => {
    if (!group) return;
    
    setIsSharing(true);
    try {
      // Create the share URL for the group
      const shareUrl = `${window.location.origin}/vikundi/${id}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Join ${group.name} on Kijumbe App`,
          text: `Check out this group: ${group.name}`,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard if Web Share API is not available
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Imefanikiwa!",
          description: "Link imeundwa nakala. Unaweza kuishirikisha sasa.",
        });
      }
    } catch (error) {
      console.error("Error sharing group:", error);
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: "Imeshindwa kuunda link kwa ajili ya kushirikisha.",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const Header = (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{group?.name || "Loading..."}</h1>
        <Button 
          size="sm" 
          variant="outline"
          className="p-1 h-8 w-8 rounded-full"
          onClick={handleShare}
          disabled={isSharing || !group}
        >
          {isSharing ? (
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          ) : (
            <Share className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AppLayout header={Header}>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout header={Header}>
        <div className="flex justify-center items-center h-full flex-col p-4">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Hitilafu imetokea</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button 
            onClick={fetchGroupDetails}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Jaribu tena
          </button>
        </div>
      </AppLayout>
    );
  }

  if (!group) {
    return (
      <AppLayout header={Header}>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Kikundi hakipatikani.</p>
        </div>
      </AppLayout>
    );
  }

  // Create a combined group object with members and transactions
  const groupWithRelations = {
    ...group,
    group_members: groupMembers,
    transactions: transactions
  };

  return (
    <AppLayout header={Header}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Muhtasari</TabsTrigger>
          <TabsTrigger value="members">Wanachama</TabsTrigger>
          <TabsTrigger value="transactions">Malipo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <GroupOverview group={groupWithRelations} />
        </TabsContent>
        <TabsContent value="members">
          <GroupMembers group={groupWithRelations} onMemberAdded={fetchGroupDetails} />
        </TabsContent>
        <TabsContent value="transactions">
          <GroupTransactions transactions={transactions} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default GroupDashboard;
