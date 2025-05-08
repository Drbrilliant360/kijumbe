
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/hooks/use-translations";

interface GroupCardProps {
  id: string;
  title: string;
  description: string;
  amount: number;
  members: string;
  progress: number;
  isAdmin?: boolean;
}

const GroupCard = ({ 
  id, 
  title, 
  description, 
  amount, 
  members, 
  progress,
  isAdmin = false
}: GroupCardProps) => {
  const { t } = useTranslations();
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
      currencyDisplay: 'narrowSymbol'
    }).format(amount).replace('TZS', '').trim();
  };

  return (
    <Link to={`/vikundi/${id}`} className="block">
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="font-bold text-xl">{title}</h3>
                {isAdmin && (
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                    {t('admin')}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
            </div>
            <Badge variant="outline" className="bg-secondary text-primary">
              {t('active')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{t('contribution')}</span>
              </div>
              <p className="font-medium">TZS {formatCurrency(amount)}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{t('members')}</span>
              </div>
              <p className="font-medium">{members}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('progress')}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default GroupCard;
