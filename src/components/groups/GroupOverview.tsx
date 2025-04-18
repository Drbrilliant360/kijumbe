
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, CreditCard } from "lucide-react";

interface GroupOverviewProps {
  group: any;
}

const GroupOverview = ({ group }: GroupOverviewProps) => {
  // Ensure we have array data even if null
  const members = group.group_members || [];
  const transactions = group.transactions || [];
  
  const totalMembers = members.length || 0;
  const totalCollected = transactions
    .filter((t: any) => t.type === 'deposit')
    .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
  const totalDebt = (group.amount * group.max_members) - totalCollected;

  return (
    <div className="grid gap-4 md:grid-cols-3 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wanachama</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}/{group.max_members}</div>
          <p className="text-xs text-muted-foreground">Wanachama waliosajiliwa</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kiasi Kilichokusanywa</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">TSH {totalCollected.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Jumla ya michango</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Deni</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">TSH {totalDebt.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Kiasi kinachohitajika</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupOverview;
