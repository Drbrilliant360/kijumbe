
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import MpangilioSettings from "@/components/mpangilio/MpangilioSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";

const Mpangilio = () => {
  const { t } = useTranslations();
  const { userName, userEmail, loading } = useUserProfile();
  
  const Header = (
    <div className="p-4">
      <h1 className="text-xl font-bold">{t('mpangilioTitle')}</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <div className="mb-6">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center p-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${userName || 'user'}`} alt={userName} />
              <AvatarFallback>{userName?.substring(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="mt-4 text-center">
              <div className="text-xl font-medium">{loading ? "Loading..." : userName}</div>
              <p className="text-gray-600">{userEmail || "Loading email..."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="settings">Mpangilio</TabsTrigger>
          <TabsTrigger value="profile">Wasifu</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <MpangilioSettings />
        </TabsContent>
        <TabsContent value="profile">
          <div className="text-center p-4 text-gray-500">
            <p>Wasifu wako unapatikana katika ukurasa wa wasifu.</p>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Mpangilio;
