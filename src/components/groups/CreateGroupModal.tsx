
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([
          {
            name,
            description,
            amount: parseInt(amount),
            max_members: parseInt(maxMembers),
            creator_id: (await supabase.auth.getUser()).data.user?.id,
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Kikundi Kimeundwa!",
        description: "Kikundi chako kipya kimeundwa kikamilifu.",
      });

      setOpen(false);
      resetForm();
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
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
          <span className="font-bold">Unda Kikundi Kipya</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Unda Kikundi Kipya</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Jina la Kikundi</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Weka jina la kikundi"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Maelezo ya Kikundi</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Weka maelezo ya kikundi"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Kiasi cha Kuchangia (TZS)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Kiasi katika shilingi"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxMembers">Idadi ya Wanachama</Label>
            <Input
              id="maxMembers"
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              placeholder="Idadi ya watu watakaoshiriki"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Ghairi
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Inaunda..." : "Unda Kikundi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
