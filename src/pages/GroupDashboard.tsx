
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupOverview from "@/components/groups/GroupOverview";
import GroupMembers from "@/components/groups/GroupMembers";
import GroupTransactions from "@/components/groups/GroupTransactions";

const GroupDashboard = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchGroupDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members (
            id,
            user_id,
            phone_number,
            joined_at
          ),
          transactions (
            id,
            amount,
            type,
            description,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setGroup(data);
    } catch (error: any) {
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
    fetchGroupDetails();
  }, [id]);

  const Header = (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{group?.name || "Loading..."}</h1>
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

  return (
    <AppLayout header={Header}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Muhtasari</TabsTrigger>
          <TabsTrigger value="members">Wanachama</TabsTrigger>
          <TabsTrigger value="transactions">Malipo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <GroupOverview group={group} />
        </TabsContent>
        <TabsContent value="members">
          <GroupMembers group={group} onMemberAdded={fetchGroupDetails} />
        </TabsContent>
        <TabsContent value="transactions">
          <GroupTransactions transactions={group.transactions} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default GroupDashboard;
