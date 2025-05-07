
import { useTranslations } from "@/hooks/use-translations";
import PaymentCard from "@/components/payments/PaymentCard";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GroupsListProps {
  groups: any[];
}

const GroupsList = ({ groups }: GroupsListProps) => {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [sharingGroup, setSharingGroup] = useState<string | null>(null);
  
  if (groups.length === 0) {
    return null;
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
        <h2 className="font-bold text-lg">Vikundi Vyangu</h2>
        <button className="text-primary font-medium text-sm">
          {t('viewAll')} &gt;
        </button>
      </div>

      {groups.map(group => (
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
          <Button 
            size="sm" 
            variant="outline"
            className="absolute right-2 top-2 p-1 h-8 w-8 rounded-full"
            onClick={() => handleShare(group.id, group.name)}
            disabled={sharingGroup === group.id}
          >
            {sharingGroup === group.id ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            ) : (
              <Share className="h-4 w-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;
