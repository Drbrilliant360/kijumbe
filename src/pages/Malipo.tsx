
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import PaymentCard from "@/components/payments/PaymentCard";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";

const Malipo = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState("current");

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
      {activeTab === "current" ? (
        <>
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

          <div className="fixed bottom-20 left-0 right-0 p-4">
            <Button className="w-full py-6 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2">
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
