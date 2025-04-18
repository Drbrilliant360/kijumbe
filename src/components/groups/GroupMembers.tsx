
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GroupMembersProps {
  group: any;
  onMemberAdded: () => void;
}

const GroupMembers = ({ group, onMemberAdded }: GroupMembersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddMember = async () => {
    if (!phoneNumber) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: group.id,
            phone_number: phoneNumber,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Mwanachama ameongezwa!",
        description: "Mwanachama mpya ameongezwa kikamilifu.",
      });

      setPhoneNumber("");
      setIsOpen(false);
      onMemberAdded();
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Wanachama ({group.group_members?.length || 0})</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ongeza Mwanachama
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ongeza Mwanachama Mpya</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Namba ya Simu</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="e.g. +255..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddMember} 
                disabled={isLoading || !phoneNumber}
                className="w-full"
              >
                {isLoading ? "Inaongeza..." : "Ongeza Mwanachama"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {group.group_members?.map((member: any) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border"
          >
            <div>
              <p className="font-medium">{member.phone_number}</p>
              <p className="text-sm text-gray-500">
                Joined: {new Date(member.joined_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
