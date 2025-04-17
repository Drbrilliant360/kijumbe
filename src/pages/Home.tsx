
import { Bell } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BalanceSummary from "@/components/home/BalanceSummary";
import QuickActions from "@/components/home/QuickActions";
import PaymentCard from "@/components/payments/PaymentCard";
import TransactionItem from "@/components/home/TransactionItem";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";

const Home = () => {
  const { t } = useTranslations();

  const Header = (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <span className="text-primary font-bold">M</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{t('greeting')}, Username</h2>
            <p className="text-gray-500 text-sm">Karibu Kijumbe App</p>
          </div>
        </div>
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );

  return (
    <AppLayout header={Header}>
      {/* Balance Summary */}
      <BalanceSummary 
        totalBalance={-1825000}
        contributions={1325000}
        payments={3150000}
        debt={20000}
        hasActive={true}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Payments */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Malipo Yajayo</h2>
          <button className="text-primary font-medium text-sm">
            {t('viewAll')} &gt;
          </button>
        </div>

        <PaymentCard 
          title="Marafiki Savings"
          amount={50000}
          dueDate="05 Apr, 2025"
          dayNumber={2}
        />

        <PaymentCard 
          title="Family Support"
          amount={25000}
          dueDate="10 Apr, 2025"
          dayNumber={7}
        />

        <PaymentCard 
          title="Business Group"
          amount={100000}
          dueDate="17 Apr, 2025"
          dayNumber={14}
        />
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Taarifa</h2>
          <button className="text-primary font-medium text-sm">
            {t('viewAll')} &gt;
          </button>
        </div>

        <TransactionItem 
          type="withdrawal"
          title="Umelipa mchango"
          description="Mchezo wa Pesa"
          amount={50000}
          date="12 Apr, 2024"
          isPositive={false}
        />

        <TransactionItem 
          type="deposit"
          title="Umepokea malipo"
          description="Mchezo wa Biashara"
          amount={120000}
          date="05 Apr, 2024"
          isPositive={true}
        />

        <TransactionItem 
          type="group"
          title="Kikundi kipya"
          description="Umeunda Mchezo wa Familia"
          amount={0}
          date="01 Apr, 2024"
          isPositive={true}
        />
      </div>
    </AppLayout>
  );
};

export default Home;
