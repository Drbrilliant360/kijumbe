
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, DollarSign, CreditCard, TrendingUp, UserCog, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface GroupOverviewProps {
  group: any;
  isAdmin: boolean;
}

const GroupOverview = ({ group, isAdmin }: GroupOverviewProps) => {
  const { t } = useTranslations();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [memberContributions, setMemberContributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Ensure we have array data even if null
  const members = group.group_members || [];
  const transactions = group.transactions || [];
  
  const totalMembers = members.length || 0;
  const totalCollected = transactions
    .filter((t: any) => t.type === 'deposit')
    .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
  const totalDebt = (group.amount * group.max_members) - totalCollected;
  
  // Calculate progress percentage
  const targetAmount = group.amount * group.max_members;
  const progressPercentage = targetAmount > 0 
    ? Math.round((totalCollected / targetAmount) * 100)
    : 0;

  // Colors for the charts
  const CHART_COLORS = ['#2e7d32', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107'];

  useEffect(() => {
    if (group && group.id) {
      fetchMemberContributions();
    }
  }, [group]);

  const fetchMemberContributions = async () => {
    setIsLoading(true);
    try {
      // Fetch all transactions for this group
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*, group_members(*)')
        .eq('group_id', group.id)
        .eq('type', 'deposit');
        
      if (error) throw error;

      // Transform the data for chart display
      const contributionMap = new Map();
      
      // First, initialize with all members
      if (members && members.length > 0) {
        members.forEach((member: any) => {
          contributionMap.set(member.phone_number, {
            name: member.phone_number,
            amount: 0,
            percentage: 0
          });
        });
      }
      
      // Then add transaction amounts
      if (transactions && transactions.length > 0) {
        transactions.forEach((transaction: any) => {
          const memberPhone = transaction.group_members?.phone_number;
          
          if (memberPhone) {
            if (contributionMap.has(memberPhone)) {
              const current = contributionMap.get(memberPhone);
              contributionMap.set(memberPhone, {
                ...current,
                amount: current.amount + transaction.amount
              });
            } else {
              contributionMap.set(memberPhone, {
                name: memberPhone,
                amount: transaction.amount,
                percentage: 0
              });
            }
          }
        });
      }
      
      // Calculate percentages
      if (totalCollected > 0) {
        contributionMap.forEach((value, key) => {
          const percentage = Math.round((value.amount / totalCollected) * 100);
          contributionMap.set(key, {
            ...value,
            percentage
          });
        });
      }
      
      // Convert map to array for charts
      const chartData = Array.from(contributionMap.values());
      setMemberContributions(chartData);
    } catch (error) {
      console.error("Error fetching member contributions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!isAdmin) return;
    
    setIsDeleting(true);
    try {
      // Update group status to deleted
      const { error } = await supabase
        .from('groups')
        .update({ status: 'deleted' })
        .eq('id', group.id);
        
      if (error) throw error;
      
      toast({
        title: "Kikundi kimefutwa",
        description: "Kikundi kimeondolewa kutoka kwenye mfumo",
      });
      
      navigate('/vikundi');
    } catch (error: any) {
      console.error("Error deleting group:", error);
      toast({
        variant: "destructive",
        title: "Hitilafu",
        description: "Imeshindwa kufuta kikundi. Tafadhali jaribu tena.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('members')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}/{group.max_members}</div>
            <p className="text-xs text-muted-foreground">{t('registered_members')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('amount_collected')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TSH {totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t('total_contributions')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('debt')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TSH {totalDebt.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t('amount_needed')}</p>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div 
                className="h-2 rounded-full bg-primary" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
            <p className="mt-1 text-xs text-right">{progressPercentage}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Member Contributions Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            {t('member_contributions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-80 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : memberContributions.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="h-80">
                <ChartContainer config={{
                  primary: {
                    theme: { light: '#2e7d32', dark: '#4caf50' }
                  }
                }}>
                  <BarChart data={memberContributions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend content={<ChartLegendContent />} />
                    <Bar 
                      dataKey="amount"
                      name="Amount"
                      fill="var(--color-primary)"
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              
              {/* Pie Chart */}
              <div className="h-80">
                <ChartContainer config={{
                  primary: { theme: { light: '#2e7d32', dark: '#4caf50' } }
                }}>
                  <PieChart>
                    <Pie
                      data={memberContributions}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="name"
                    >
                      {memberContributions.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <ChartLegend layout="vertical" verticalAlign="middle" align="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center text-muted-foreground">
              <p>{t('no_contributions_yet')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Actions Section */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCog className="mr-2 h-5 w-5" />
              {t('admin_actions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('admin_privileges_description')}
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="flex items-center"
              >
                <Trash className="mr-2 h-4 w-4" />
                Futa Kikundi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Group Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Una uhakika unataka kufuta kikundi?</AlertDialogTitle>
            <AlertDialogDescription>
              Hatua hii haiwezi kurudishwa. Kikundi kitasafishwa kutoka kwenye mfumo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ghairi</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Inafuta..." : "Futa Kikundi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupOverview;
