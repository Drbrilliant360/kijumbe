
import { Card } from "@/components/ui/card";

interface GroupTransactionsProps {
  transactions: any[];
}

const GroupTransactions = ({ transactions = [] }: GroupTransactionsProps) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Historia ya Malipo</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">TSH {transaction.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{transaction.description || 'No description'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium capitalize">{transaction.type}</p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Hakuna malipo yaliyofanyika bado.
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupTransactions;
