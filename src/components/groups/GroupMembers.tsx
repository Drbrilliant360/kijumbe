import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GroupMembersProps {
  group: any;
  onMemberAdded?: () => void;
}

const GroupMembers = ({ group, onMemberAdded }: GroupMembersProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const addMember = async () => {
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: "Tafadhali ingiza namba ya simu."
      });
      return;
    }

    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          phone_number: phoneNumber,
          user_id: userData.user.id // Add the required user_id
        });

      if (error) throw error;

      toast({
        title: "Imefanikiwa!",
        description: "Mwanachama ameongezwa kwenye kikundi."
      });
      
      onMemberAdded && onMemberAdded();
      setPhoneNumber('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: error.message
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Wanachama wa Kikundi</h2>
      <Card>
        <CardHeader>
          <CardTitle>Ongeza Mwanachama</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone_number">Namba ya Simu</Label>
            <Input
              type="tel"
              id="phone_number"
              placeholder="Ingiza namba ya simu"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <Button onClick={addMember}>Ongeza Mwanachama</Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Orodha ya Wanachama</h3>
        {group.group_members && group.group_members.length > 0 ? (
          <ul className="list-none p-0">
            {group.group_members.map((member: any) => (
              <li key={member.id} className="py-2 border-b border-gray-200 last:border-b-0">
                {member.phone_number}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Hakuna wanachama kwenye kikundi hiki.</p>
        )}
      </div>
    </div>
  );
};

export default GroupMembers;
