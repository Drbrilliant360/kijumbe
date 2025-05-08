
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Check, Clock, Plus, X } from "lucide-react";

interface GroupTransactionsProps {
  transactions: any[];
  isAdmin: boolean;
  groupId: string;
  onTransactionAdded?: () => void;
}

const GroupTransactions = ({ 
  transactions = [],
  isAdmin,
  groupId,
  onTransactionAdded
}: GroupTransactionsProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();
  
  const handleAddTransaction = async () => {
    if (!amount || parseInt(amount) <= 0) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('enter_valid_amount')
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error(t('auth_required'));
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userData.user.id,
          group_id: groupId,
          amount: parseInt(amount),
          description,
          type: 'deposit'
        });
        
      if (error) throw error;
      
      toast({
        title: t('success'),
        description: t('transaction_added')
      });
      
      setAmount('');
      setDescription('');
      setShowAddForm(false);
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="p-4 space-y-6">
      {/* Transaction Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('payment_history')}</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "outline" : "default"}
          size="sm"
        >
          {showAddForm ? (
            <>{t('cancel')}</>
          ) : (
            <>
              <Plus className="mr-1 h-4 w-4" />
              {t('add_payment')}
            </>
          )}
        </Button>
      </div>
      
      {/* Add Transaction Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('add_payment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t('amount')} (TZS)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  onClick={handleAddTransaction}
                  disabled={isSubmitting || !amount}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                  ) : null}
                  {t('save')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0 pt-6">
          {sortedTransactions && sortedTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('amount')}</TableHead>
                    <TableHead>{t('description')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        TSH {transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {transaction.description || '-'}
                      </TableCell>
                      <TableCell className="flex items-center">
                        {getStatusIcon(transaction.status)}
                        <span className="ml-2 capitalize">{transaction.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('no_transactions')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupTransactions;
