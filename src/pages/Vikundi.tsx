
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical, Users, Calendar, ArrowRight } from "lucide-react";
import GroupCard from "@/components/groups/GroupCard";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import { supabase } from "@/integrations/supabase/client";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Vikundi = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState("active");
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      // Step 1: Get the groups with simple query
      let query = supabase
        .from('groups')
        .select('*');
      
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data: groupsData, error: groupsError } = await query;
      
      if (groupsError) throw groupsError;
      
      // Step 2: Get member counts for each group separately
      if (groupsData && groupsData.length > 0) {
        const groupsWithMemberCounts = await Promise.all(
          groupsData.map(async (group) => {
            const { count, error: countError } = await supabase
              .from('group_members')
              .select('id', { count: 'exact', head: true })
              .eq('group_id', group.id);
            
            return {
              ...group,
              memberCount: countError ? 0 : (count || 0)
            };
          })
        );
        
        setGroups(groupsWithMemberCounts);
      } else {
        setGroups([]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: "Imeshindwa kupata vikundi: " + error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [activeTab, searchQuery]);

  const Header = (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{t('groups')}</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Tafuta kikundi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-full text-sm border border-gray-200"
            />
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
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
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-4 pb-24">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              title={group.name}
              description={group.description || ""}
              amount={group.amount}
              members={`${group.memberCount || 0}/${group.max_members}`}
              progress={Math.min(100, ((group.memberCount || 0) / group.max_members) * 100)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hakuna Vikundi</h3>
          <p className="text-gray-500 mb-6">Hakuna vikundi vilivyopatikana. Unda kikundi kipya kuanza.</p>
        </div>
      )}

      {/* Add Group Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4">
        <CreateGroupModal onSuccess={fetchGroups} />
      </div>
    </AppLayout>
  );
};

export default Vikundi;
