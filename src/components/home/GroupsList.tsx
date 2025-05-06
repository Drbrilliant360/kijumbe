
import { useTranslations } from "@/hooks/use-translations";
import PaymentCard from "@/components/payments/PaymentCard";

interface GroupsListProps {
  groups: any[];
}

const GroupsList = ({ groups }: GroupsListProps) => {
  const { t } = useTranslations();
  
  if (groups.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg">Vikundi Vyangu</h2>
        <button className="text-primary font-medium text-sm">
          {t('viewAll')} &gt;
        </button>
      </div>

      {groups.map(group => (
        <PaymentCard 
          key={group.id}
          title={group.name}
          amount={group.amount}
          dueDate={new Date(group.created_at).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
          dayNumber={7}
        />
      ))}
    </div>
  );
};

export default GroupsList;
