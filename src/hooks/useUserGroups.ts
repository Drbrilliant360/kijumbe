
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/use-translations";

export const useUserGroups = (userId: string | null) => {
  const { toast } = useToast();
  const { t } = useTranslations();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      // Get groups where user is creator or member in a single query
      const { data: userGroups, error: userGroupsError } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(user_id)
        `)
        .or(`creator_id.eq.${userId},group_members.user_id.eq.${userId}`)
        .eq('status', 'active');
        
      if (userGroupsError) throw userGroupsError;
      
      if (userGroups && userGroups.length > 0) {
        // Get member counts for each group
        const groupsWithDetails = await Promise.all(
          userGroups.map(async (group) => {
            const { count, error: countError } = await supabase
              .from('group_members')
              .select('id', { count: 'exact', head: true })
              .eq('group_id', group.id);
              
            // Calculate progress
            const { data: transactionData } = await supabase
              .from('transactions')
              .select('amount')
              .eq('group_id', group.id)
              .eq('type', 'deposit');
              
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
        
        setGroups(sortedGroups);
      } else {
        setGroups([]);
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failed_to_load_groups")
      });
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading, refreshGroups: fetchGroups };
};
