
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserGroups = (userId: string | null) => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchGroups();
    }
  }, [userId]);

  const fetchGroups = async () => {
    try {
      // Simplify the query to avoid the recursion issue
      const { data, error } = await supabase
        .from('groups')
        .select('*') // Only select the group data, not the related members
        .eq('status', 'active')
        .limit(3);

      if (error) throw error;
      
      // Fetch group member counts separately
      if (data && data.length > 0) {
        const groupsWithMemberCounts = await Promise.all(
          data.map(async (group) => {
            const { count, error: countError } = await supabase
              .from('group_members')
              .select('id', { count: 'exact', head: true })
              .eq('group_id', group.id);
            
            return {
              ...group,
              memberCount: countError ? 0 : (count || 0)
            };
          })
        );
        setGroups(groupsWithMemberCounts);
      } else {
        setGroups([]);
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load groups"
      });
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading };
};
