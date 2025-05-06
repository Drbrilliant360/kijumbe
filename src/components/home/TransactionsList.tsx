
import { useTranslations } from "@/hooks/use-translations";
import TransactionItem from "@/components/home/TransactionItem";

interface TransactionsListProps {
  transactions: any[];
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const { t } = useTranslations();
  
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
