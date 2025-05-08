
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import MpangilioSettings from "@/components/mpangilio/MpangilioSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Mpangilio = () => {
  const { t } = useTranslations();
  
  const Header = (
    <div className="p-4">
      <h1 className="text-xl font-bold">{t('mpangilioTitle')}</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
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
