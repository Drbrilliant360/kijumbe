
import { useTranslations } from "@/hooks/use-translations";
import PaymentCard from "@/components/payments/PaymentCard";
import { Share, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface GroupsListProps {
  groups: any[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const GroupsList = ({ groups, loading = false, error = null, onRetry }: GroupsListProps) => {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [sharingGroup, setSharingGroup] = useState<string | null>(null);
  
  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full mb-2 rounded-lg" />
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">{t("myGroups")}</h2>
          <Link to="/vikundi" className="text-primary font-medium text-sm hover:underline transition-all">
            {t("viewAll")} &gt;
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error")}</AlertTitle>
          <AlertDescription className="flex items-center">
            {t("failed_to_load_groups")}
            {onRetry && (
              <Button variant="link" onClick={onRetry} className="p-0 h-auto text-sm text-white underline ml-2">
                {t("try_again")}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!loading && groups.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">{t("myGroups")}</h2>
          <Link to="/vikundi" className="text-primary font-medium text-sm hover:underline transition-all">
            {t("viewAll")} &gt;
          </Link>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-200">
          <p className="text-muted-foreground">{t("noGroups")}</p>
          <Link to="/vikundi">
            <Button variant="outline" className="mt-2">
              {t("createGroup")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async (groupId: string, groupName: string) => {
    setSharingGroup(groupId);
    
    try {
      // Create the share URL for the group
      const shareUrl = `${window.location.origin}/vikundi/${groupId}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Join ${groupName} on Kijumbe App`,
          text: `Check out this group: ${groupName}`,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard if Web Share API is not available
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Imefanikiwa!",
          description: "Link imeundwa nakala. Unaweza kuishirikisha sasa.",
        });
      }
    } catch (error) {
      console.error("Error sharing group:", error);
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: "Imeshindwa kuunda link kwa ajili ya kushirikisha.",
      });
    } finally {
      setSharingGroup(null);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg">{t("myGroups")}</h2>
        <Link to="/vikundi" className="text-primary font-medium text-sm hover:underline transition-all">
          {t("viewAll")} &gt;
        </Link>
      </div>

      {groups.slice(0, 3).map(group => (
        <div key={group.id} className="mb-2 relative">
          <PaymentCard 
            title={group.name}
            amount={group.amount}
            dueDate={new Date(group.created_at).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
            dayNumber={7}
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="p-1 h-8 w-8 rounded-full hover:bg-primary/10"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">{group.name}</h4>
                  <p className="text-sm text-muted-foreground">{group.description || t("noDescription")}</p>
                  <div className="flex justify-between text-sm">
                    <span>{t("members")}</span>
                    <span className="font-medium">{group.memberCount}/{group.max_members}</span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="p-1 h-8 w-8 rounded-full hover:bg-primary/10"
                  onClick={() => handleShare(group.id, group.name)}
                  disabled={sharingGroup === group.id}
                >
                  {sharingGroup === group.id ? (
                    <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  ) : (
                    <Share className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("shareGroup")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;
