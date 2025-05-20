
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupOverview from "@/components/groups/GroupOverview";
import GroupMembers from "@/components/groups/GroupMembers";
import GroupTransactions from "@/components/groups/GroupTransactions";
import { Share, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Loading from "@/components/ui/loading";

const GroupDashboard = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();
  const { userId } = useUserProfile();

  const fetchGroupDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    if (!userId) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }
    
    try {
      // Fetch the group details first
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();

      if (groupError) throw groupError;
      
      // Check if user is a member of this group
      const { data: membershipData, error: membershipError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', id)
        .eq('user_id', userId);
        
      if (membershipError) throw membershipError;
      
      // If user is not a member and not the creator, block access
      if (groupData.creator_id !== userId && (!membershipData || membershipData.length === 0)) {
        throw new Error("You don't have permission to view this group");
      }
      
      // Check if user is the group admin (creator)
      setIsGroupAdmin(groupData.creator_id === userId);
      
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
        title: t('error'),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id && userId) {
      fetchGroupDetails();
    }
  }, [id, userId]);

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
          title: t('success'),
          description: t('link_copied'),
        });
      }
    } catch (error) {
      console.error("Error sharing group:", error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('share_error'),
      });
    } finally {
      setIsSharing(false);
    }
  };

  const Header = (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{group?.name || t('loading')}</h1>
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
        <div className="flex justify-center items-center h-full py-12">
          <Loading size="md" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout header={Header}>
        <div className="p-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('error_occurred')}</AlertTitle>
            <AlertDescription className="flex flex-col">
              <p>{error}</p>
              <Button 
                variant="outline" 
                onClick={fetchGroupDetails} 
                className="mt-4 self-start"
              >
                {t('try_again')}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  if (!group) {
    return (
      <AppLayout header={Header}>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">{t('group_not_found')}</p>
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
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="members">{t('members')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('payments')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <GroupOverview group={groupWithRelations} isAdmin={isGroupAdmin} />
        </TabsContent>
        <TabsContent value="members">
          <GroupMembers 
            group={groupWithRelations} 
            onMemberAdded={fetchGroupDetails} 
            isAdmin={isGroupAdmin}
          />
        </TabsContent>
        <TabsContent value="transactions">
          <GroupTransactions 
            transactions={transactions} 
            isAdmin={isGroupAdmin} 
            groupId={group.id}
            onTransactionAdded={fetchGroupDetails}
          />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default GroupDashboard;
