
import ProfileSettings from "@/components/profile/ProfileSettings";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { t } = useTranslations();
  const { userName, loading, userEmail } = useUserProfile();
  
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
