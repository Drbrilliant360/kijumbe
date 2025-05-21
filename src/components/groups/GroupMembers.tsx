import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslations } from "@/hooks/use-translations";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { ChevronDown, ChevronUp, UserPlus, User, Phone, Eye, UserX } from "lucide-react";

interface GroupMembersProps {
  group: any;
  onMemberAdded?: () => void;
  isAdmin: boolean;
}

const GroupMembers = ({ group, onMemberAdded, isAdmin }: GroupMembersProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [sortBy, setSortBy] = useState<string>('joined_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [isViewingMember, setIsViewingMember] = useState(false);
  const [memberProfiles, setMemberProfiles] = useState<{[key: string]: any}>({});
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  useEffect(() => {
    if (isAdmin && group?.group_members?.length > 0) {
      fetchMemberProfiles();
    }
  }, [group.group_members, isAdmin]);

  const fetchMemberProfiles = async () => {
    if (!isAdmin) return;
    
    try {
      // Get unique user IDs from group members
      const userIds = group.group_members
        .filter((member: any) => member.user_id)
        .map((member: any) => member.user_id);
      
      if (userIds.length === 0) return;
      
      // Fetch profiles for these users
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);
        
      if (error) throw error;
      
      // Create a map of user_id to profile
      const profileMap: {[key: string]: any} = {};
      if (data) {
        data.forEach(profile => {
          profileMap[profile.user_id] = profile;
        });
      }
      
      setMemberProfiles(profileMap);
    } catch (error) {
      console.error("Error fetching member profiles:", error);
    }
  };

  const addMember = async () => {
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('enter_phone_number')
      });
      return;
    }

    setIsAdding(true);

    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error(t('auth_required'));

      // Check if the member already exists in the group
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .eq('phone_number', phoneNumber);
        
      if (existingMember && existingMember.length > 0) {
        throw new Error(t('member_already_exists'));
      }

      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          phone_number: phoneNumber,
          user_id: userData.user.id // This is required
        });

      if (error) {
        console.error("Error adding member:", error);
        throw error;
      }

      toast({
        title: t('success'),
        description: t('member_added')
      });
      
      onMemberAdded && onMemberAdded();
      setPhoneNumber('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Sort members
  const sortedMembers = [...(group.group_members || [])].sort((a, b) => {
    if (sortBy === 'joined_at') {
      return sortDirection === 'asc'
        ? new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
        : new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime();
    }
    return 0;
  });

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Get sorting icon
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const viewMemberDetails = (member: any) => {
    if (!isAdmin) return;
    
    const profile = member.user_id ? memberProfiles[member.user_id] : null;
    setMemberDetails({
      ...member,
      profile
    });
    setIsViewingMember(true);
  };

  const removeMember = async (memberId: string) => {
    if (!isAdmin) return;
    
    setIsRemoving(true);
    try {
      // Delete the member from the group
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      toast({
        title: "Mshiriki ameondolewa",
        description: "Mshiriki ameondolewa kikundi kikamilifu",
      });
      
      // Close the member details sheet
      setIsViewingMember(false);
      
      // Refresh the group data
      onMemberAdded && onMemberAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hitilafu",
        description: "Imeshindwa kuondoa mshiriki. Tafadhali jaribu tena.",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Add Member Form - Only visible to admins */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              {t('add_member')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="phone_number">{t('phone_number')}</Label>
                <Input
                  type="tel"
                  id="phone_number"
                  placeholder={t('enter_phone_number_placeholder')}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={addMember} 
                  className="w-full" 
                  disabled={isAdding || !phoneNumber}
                >
                  {isAdding ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                  ) : null}
                  {t('add_member')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('members_list')}</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedMembers && sortedMembers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('member')}</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => toggleSort('joined_at')}
                  >
                    <div className="flex items-center">
                      {t('joined_date')}
                      {getSortIcon('joined_at')}
                    </div>
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMembers.map((member: any) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.phone_number}</TableCell>
                    <TableCell>{new Date(member.joined_at).toLocaleDateString()}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewMemberDetails(member)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('view')}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">{t('no_members')}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Member Details Sheet */}
      <Sheet open={isViewingMember} onOpenChange={setIsViewingMember}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Taarifa za Mshiriki</SheetTitle>
            <SheetDescription>Taarifa za mshiriki wa kikundi</SheetDescription>
          </SheetHeader>
          
          {memberDetails && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Namba ya Simu</Label>
                  <div className="flex items-center mt-1 p-2 bg-muted rounded-md">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{memberDetails.phone_number}</span>
                  </div>
                </div>
                
                {memberDetails.profile && (
                  <>
                    <div>
                      <Label>Jina Kamili</Label>
                      <div className="p-2 bg-muted rounded-md mt-1">
                        {memberDetails.profile.full_name || 'Haijasajiliwa'}
                      </div>
                    </div>
                    
                    {memberDetails.profile.email && (
                      <div>
                        <Label>Barua pepe</Label>
                        <div className="p-2 bg-muted rounded-md mt-1">
                          {memberDetails.profile.email}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div>
                  <Label>Tarehe ya Kujiunga</Label>
                  <div className="p-2 bg-muted rounded-md mt-1">
                    {new Date(memberDetails.joined_at).toLocaleString()}
                  </div>
                </div>
                
                {/* Admin Actions */}
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => removeMember(memberDetails.id)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    ) : (
                      <UserX className="h-4 w-4 mr-2" />
                    )}
                    Ondoa Kwenye Kikundi
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default GroupMembers;
