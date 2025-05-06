
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserTransactions = (userId: string | null) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId]);

  const fetchTransactions = async (userId: string) => {
    try {
      // Simplify the query to avoid potential recursion issues
      const { data, error } = await supabase
        .from('transactions')
        .select('id, amount, type, description, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load transactions"
      });
    } finally {
      setLoading(false);
    }
  };

  return { transactions, loading };
};
