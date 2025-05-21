
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
      setGroups([]);
      setLoading(false);
    }
  }, [userId]);

  const fetchGroups = async () => {
    if (!userId) {
      setGroups([]);
      setLoading(false);
      return;
    }
    
    try {
      // First get groups where the user is a creator (admin)
      const { data: createdGroups, error: createdError } = await supabase
        .from('groups')
        .select('*')
        .eq('creator_id', userId)
        .eq('status', 'active');

      if (createdError) throw createdError;
      
      // Then get groups where the user is a member
      const { data: memberGroups, error: memberError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId);
        
      if (memberError) throw memberError;
      
      // If user is a member of any group, fetch those group details
      let joinedGroups: any[] = [];
      
      if (memberGroups && memberGroups.length > 0) {
        const groupIds = memberGroups.map(member => member.group_id);
        
        const { data: groups, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .in('id', groupIds)
          .eq('status', 'active');
          
        if (groupsError) throw groupsError;
        
        joinedGroups = groups || [];
      }
      
      // Combine unique groups (avoiding duplicates if user is both creator and member)
      const allGroups = [...(createdGroups || [])];
      
      // Add joined groups that are not already in the list (to avoid duplicates)
      joinedGroups.forEach(group => {
        if (!allGroups.some(g => g.id === group.id)) {
          allGroups.push(group);
        }
      });
      
      // Fetch group member counts for each group
      if (allGroups.length > 0) {
        const groupsWithMemberCounts = await Promise.all(
          allGroups.map(async (group) => {
            const { count, error: countError } = await supabase
              .from('group_members')
              .select('id', { count: 'exact', head: true })
              .eq('group_id', group.id);
              
            // Calculate progress percentage
            const { data: transactionData, error: transactionError } = await supabase
              .from('transactions')
              .select('amount')
              .eq('group_id', group.id)
              .eq('type', 'deposit');
              
            let collectedAmount = 0;
            
            if (!transactionError && transactionData) {
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
        const sortedGroups = groupsWithMemberCounts.sort((a, b) => {
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
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading, refreshGroups: fetchGroups };
};
