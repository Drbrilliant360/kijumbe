
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import MpangilioSettings from "@/components/mpangilio/MpangilioSettings";
import ProfileSettings from "@/components/profile/ProfileSettings";

const Mpangilio = () => {
  const { t } = useTranslations();
  const { loading } = useUserProfile();
  
  const Header = (
    <div className="p-4">
      <h1 className="text-xl font-bold">{t('mpangilioTitle')}</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <div className="space-y-4">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Mpangilio</TabsTrigger>
            <TabsTrigger value="profile">Wasifu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="pt-4">
            <MpangilioSettings />
          </TabsContent>
          
          <TabsContent value="profile" className="pt-4">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Mpangilio;
