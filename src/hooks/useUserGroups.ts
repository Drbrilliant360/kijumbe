
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/use-translations";

export const useUserGroups = (userId: string | null) => {
  const { toast } = useToast();
  const { t } = useTranslations();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchGroups();
    } else {
      setLoading(false);
      setGroups([]);
    }
  }, [userId]);

  const fetchGroups = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching groups for user:", userId);
      
      // Fixed the query by using proper OR syntax
      const { data: userGroups, error: userGroupsError } = await supabase
        .from('groups')
        .select(`
          *,
          group_members(user_id)
        `)
        .or(`creator_id.eq.${userId},group_members.user_id.eq.${userId}`);
        
      if (userGroupsError) {
        console.error("Error fetching groups:", userGroupsError);
        throw userGroupsError;
      }
      
      console.log("Groups data received:", userGroups);
      
      if (userGroups && userGroups.length > 0) {
        // Get member counts for each group
        const groupsWithDetails = await Promise.all(
          userGroups.map(async (group) => {
            const { count, error: countError } = await supabase
              .from('group_members')
              .select('id', { count: 'exact', head: true })
              .eq('group_id', group.id);
              
            if (countError) {
              console.error("Error fetching member count:", countError);
            }
              
            // Calculate progress
            const { data: transactionData, error: transactionError } = await supabase
              .from('transactions')
              .select('amount')
              .eq('group_id', group.id)
              .eq('type', 'deposit');
              
            if (transactionError) {
              console.error("Error fetching transactions:", transactionError);
            }
              
            let collectedAmount = 0;
            
            if (transactionData) {
              collectedAmount = transactionData.reduce((sum, t) => sum + t.amount, 0);
            }
            
            const targetAmount = group.amount * group.max_members;
            const progress = targetAmount > 0 
              ? Math.round((collectedAmount / targetAmount) * 100) 
              : 0;
              
            // Add admin flag
            const isAdmin = group.creator_id === userId;
            
            return {
              ...group,
              memberCount: countError ? 0 : (count || 0),
              progress,
              isAdmin
            };
          })
        );
        
        // Sort groups: admin groups first, then by creation date
        const sortedGroups = groupsWithDetails.sort((a, b) => {
          if (a.isAdmin && !b.isAdmin) return -1;
          if (!a.isAdmin && b.isAdmin) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        console.log("Processed groups:", sortedGroups);
        setGroups(sortedGroups);
      } else {
        console.log("No groups found for user");
        setGroups([]);
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      setError(error.message || "Unknown error");
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failed_to_load_groups")
      });
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading, error, refreshGroups: fetchGroups };
};
