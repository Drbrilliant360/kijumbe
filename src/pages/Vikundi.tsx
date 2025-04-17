
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical } from "lucide-react";
import GroupCard from "@/components/groups/GroupCard";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";

const Vikundi = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState("active");

  const Header = (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{t('groups')}</h1>
        <div className="flex items-center gap-2">
          <button className="p-2">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          className={`py-2 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === "active"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200"
          }`}
          onClick={() => setActiveTab("active")}
        >
          {t('activeGroups')}
        </button>
        <button
          className={`py-2 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === "completed"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          {t('completedGroups')}
        </button>
        <button
          className={`py-2 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === "upcoming"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          {t('upcomingGroups')}
        </button>
      </div>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <GroupCard
        title="Mchezo wa Pesa"
        description="Mchezo wa Pesa"
        amount={50000}
        members="5/10"
        progress={20}
      />

      <GroupCard
        title="Kuchangiana Mtaji wa Biashara"
        description="Mchezo wa Biashara"
        amount={100000}
        members="4/5"
        progress={20}
      />

      {/* Add Group Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4">
        <Button className="w-full py-6 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          <span className="font-bold">{t('addNewGroup')}</span>
        </Button>
      </div>
    </AppLayout>
  );
};

export default Vikundi;
