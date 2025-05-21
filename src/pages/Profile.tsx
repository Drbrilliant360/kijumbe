
import ProfileSettings from "@/components/profile/ProfileSettings";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { t } = useTranslations();
  const { userName, loading, userEmail, userId } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Haujaingia",
          description: "Tafadhali ingia kwenye akaunti yako kuona wasifu.",
          variant: "destructive"
        });
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/home">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t("profileTitle")}</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <div className="max-w-lg mx-auto">
        <ProfileSettings />
      </div>
    </AppLayout>
  );
};

export default Profile;
