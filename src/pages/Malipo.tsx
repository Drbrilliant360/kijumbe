
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import PaymentCard from "@/components/payments/PaymentCard";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Malipo = () => {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("current");
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [activeTab]);

  const fetchPayments = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*, groups(*)')
        .eq('user_id', user.user.id)
        .eq('type', 'debt')
        .order('created_at', { ascending: false });

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

      fetchPayments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
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
    </div>
  );

  return (
    <AppLayout header={Header}>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === "current" ? (
        <>
          {payments.map((payment) => (
            <PaymentCard 
              key={payment.id}
              title={payment.groups?.name || "Payment"}
              amount={payment.amount}
              dueDate={new Date(payment.created_at).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
              dayNumber={Math.ceil((new Date(payment.created_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24))}
              onPay={() => handlePayment(payment.id)}
            />
          ))}

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
        </>
      ) : (
        <div className="mt-4 text-center text-gray-500">
          <p>No payment history available.</p>
        </div>
      )}
    </AppLayout>
  );
};

export default Malipo;
