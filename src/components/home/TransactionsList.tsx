
import { useTranslations } from "@/hooks/use-translations";
import TransactionItem from "@/components/home/TransactionItem";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionsListProps {
  transactions: any[];
  loading?: boolean;
}

const TransactionsList = ({ transactions, loading = false }: TransactionsListProps) => {
  const { t } = useTranslations();
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg">Taarifa</h2>
        <button className="text-primary font-medium text-sm">
          {t('viewAll')} &gt;
        </button>
      </div>

      {transactions.length > 0 ? (
        transactions.map(transaction => (
          <TransactionItem 
            key={transaction.id}
            type={transaction.type}
            title={transaction.description || "Transaction"}
            description={transaction.group_id ? "Group Payment" : "Individual Payment"}
            amount={transaction.amount}
            date={new Date(transaction.created_at).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
            isPositive={transaction.type === 'deposit'}
          />
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          No transactions found.
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
