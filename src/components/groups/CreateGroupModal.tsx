
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/use-translations";

interface CreateGroupModalProps {
  onSuccess?: () => void;
}

const CreateGroupModal = ({ onSuccess }: CreateGroupModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslations();

  useEffect(() => {
    // Get current user's ID
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };
    
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userId) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('login_required'),
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create the group
      const { data, error } = await supabase
        .from('groups')
        .insert([
          {
            name,
            description,
            amount: parseInt(amount),
            max_members: parseInt(maxMembers),
            creator_id: userId,
          }
        ])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Automatically add the creator as a member of the group
        const groupId = data[0].id;
        
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: groupId,
            user_id: userId,
            phone_number: 'Admin' // Placeholder for creator's phone
          });
          
        if (memberError) {
          console.error("Error adding creator as member:", memberError);
        }
      }

      toast({
        title: t('group_created'),
        description: t('group_created_success'),
      });

      setOpen(false);
      resetForm();
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setAmount("");
    setMaxMembers("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full py-6 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          <span className="font-bold">{t('create_new_group')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('create_new_group')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('group_name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enter_group_name')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('group_description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('enter_group_description')}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">{t('contribution_amount')} (TZS)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('amount_placeholder')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxMembers">{t('member_count')}</Label>
            <Input
              id="maxMembers"
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              placeholder={t('member_count_placeholder')}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !userId}>
              {isLoading ? t('creating') : t('create_group')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
