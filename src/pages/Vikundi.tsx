
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical, Users, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import GroupCard from "@/components/groups/GroupCard";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import { supabase } from "@/integrations/supabase/client";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import Loading from "@/components/ui/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Vikundi = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState("active");
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { userId } = useUserProfile();

  const fetchGroups = async () => {
    if (!userId) {
      setIsLoading(false);
      setError("User not authenticated");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching groups for user:", userId);
      
      // Query to get groups where user is either creator or member
      let query = supabase
        .from('groups')
        .select(`
          *,
          group_members(user_id)
        `)
        .or(`creator_id.eq.${userId},group_members.user_id.eq.${userId})`);
      
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data: groupsData, error: groupsError } = await query;
      
      if (groupsError) {
        console.error("Error fetching groups:", groupsError);
        throw groupsError;
      }
      
      console.log("Raw groups data:", groupsData);
      
      // Step 2: Get member counts for each group separately
      if (groupsData && groupsData.length > 0) {
        const groupsWithMemberCounts = await Promise.all(
          groupsData.map(async (group) => {
            const { count, error: countError } = await supabase
              .from('group_members')
              .select('id', { count: 'exact', head: true })
              .eq('group_id', group.id);
            
            if (countError) {
              console.error("Error fetching member count:", countError);
            }
            
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
      console.error("Error fetching groups:", error);
      setError(error.message || "Unknown error");
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failed_to_load_groups") + ": " + (error.message || "")
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGroups();
    } else {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, userId]);

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
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("options")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          className={`py-2 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === "active"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          }`}
          onClick={() => setActiveTab("active")}
        >
          {t('activeGroups')}
        </button>
        <button
          className={`py-2 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === "completed"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          {t('completedGroups')}
        </button>
        <button
          className={`py-2 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === "upcoming"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
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
      {error && (
        <Alert variant="destructive" className="mb-4 mx-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error")}</AlertTitle>
          <AlertDescription>
            {t("failed_to_load_groups")}
            <Button variant="link" onClick={fetchGroups} className="p-0 h-auto text-sm text-white underline ml-2">
              {t("try_again")}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loading size="md" />
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
              isAdmin={group.creator_id === userId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("noGroups")}</h3>
          <p className="text-gray-500 mb-6">{t("noGroups")}</p>
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
