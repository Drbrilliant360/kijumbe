
import ProfileSettings from "@/components/profile/ProfileSettings";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";

const Profile = () => {
  const { t } = useTranslations();
  
  const Header = (
    <div className="p-4">
      <h1 className="text-xl font-bold">{t("profileTitle")}</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <ProfileSettings />
    </AppLayout>
  );
};

export default Profile;
