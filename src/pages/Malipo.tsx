
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Filter, Check, X } from "lucide-react";
import PaymentCard from "@/components/payments/PaymentCard";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Malipo = () => {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("current");
  const [payments, setPayments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (activeTab === "current") {
      fetchCurrentPayments();
    } else {
      fetchPaymentHistory();
    }
  }, [activeTab, statusFilter]);

  const fetchCurrentPayments = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const query = supabase
        .from('transactions')
        .select('*, groups(*)')
        .eq('user_id', user.user.id)
        .eq('type', 'debt');
      
      if (statusFilter !== "all") {
        query.eq('status', statusFilter);
      }
        
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const query = supabase
        .from('transactions')
        .select('*, groups(*)')
        .eq('user_id', user.user.id)
        .eq('status', 'completed');
      
      if (statusFilter !== "all") {
        if (statusFilter === "pending") {
          return; // No pending transactions in history (they're all completed)
        }
      }
        
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment completed successfully"
      });

      // Refresh current payments
      fetchCurrentPayments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  // Calculate days correctly
  const calculateDayNumber = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0; // Ensure it's not negative
  };

  const Header = (
    <div className="p-4">
      <div className="flex border-b">
        <button
          className={`py-3 px-4 w-1/2 text-center font-medium ${
            activeTab === "current"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("current")}
        >
          {t('currentPayments')}
        </button>
        <button
          className={`py-3 px-4 w-1/2 text-center font-medium ${
            activeTab === "history"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("history")}
        >
          {t('paymentHistory')}
        </button>
      </div>
      <div className="flex justify-end pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-1">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const renderPayments = (items: any[]) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-lg">Hakuna malipo</h3>
          <p className="text-gray-500 mt-1">No payments found for the selected filter.</p>
        </div>
      );
    }

    return items.map((payment) => (
      <PaymentCard 
        key={payment.id}
        title={payment.groups?.name || "Payment"}
        amount={payment.amount}
        dueDate={new Date(payment.created_at).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}
        dayNumber={calculateDayNumber(payment.created_at)}
        status={payment.status}
        onPay={activeTab === "current" ? () => handlePayment(payment.id) : undefined}
      />
    ));
  };

  return (
    <AppLayout header={Header}>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === "current" ? (
        <div className="mb-24">
          {renderPayments(payments)}
        </div>
      ) : (
        <div className="mb-24">
          {renderPayments(history)}
        </div>
      )}

      {activeTab === "current" && payments.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-4">
          <Button 
            className="w-full py-6 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            onClick={() => toast({
              title: "Info",
              description: "Select a payment above to process it"
            })}
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-bold">{t('makePayment')}</span>
          </Button>
        </div>
      )}
    </AppLayout>
  );
};

export default Malipo;
