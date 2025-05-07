
import AppLayout from "@/components/layout/AppLayout";
import { useTranslations } from "@/hooks/use-translations";
import MpangilioSettings from "@/components/mpangilio/MpangilioSettings";

const Mpangilio = () => {
  const { t } = useTranslations();
  
  const Header = (
    <div className="p-4">
      <h1 className="text-xl font-bold">{t('mpangilioTitle')}</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <MpangilioSettings />
    </AppLayout>
  );
};

export default Mpangilio;
