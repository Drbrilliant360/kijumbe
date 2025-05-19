
import SettingsItem from "../settings-items/SettingsItem";
import SettingsToggleItem from "../settings-items/SettingsToggleItem";
import { KeyRound, Shield, Fingerprint, LogOut, Smartphone, HelpCircle } from "lucide-react";
import { useState } from "react";

const AccountSecuritySection = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-700 px-4">Akaunti & Usalama</h2>
      
      <SettingsItem
        icon={<KeyRound className="w-5 h-5 text-primary" />}
        title="Badilisha Nywila / PIN"
        description="Sanidi neno la siri au namba ya siri"
        to="/mpangilio/password"
      />

      <SettingsItem
        icon={<HelpCircle className="w-5 h-5 text-primary" />}
        title="Swali la Usalama"
        description="Weka swali la usalama kwa ajili ya kurejeshea akaunti"
        to="/mpangilio/security-question"
      />

      <SettingsToggleItem
        icon={<Shield className="w-5 h-5 text-primary" />}
        title="Uthibitishaji wa Hatua Mbili (2FA)"
        description="Ongeza usalama kwa uthibitishaji wa ziada"
        checked={twoFactorEnabled}
        onCheckedChange={setTwoFactorEnabled}
      />

      <SettingsToggleItem
        icon={<Fingerprint className="w-5 h-5 text-primary" />}
        title="Kipengele cha Biometric"
        description="Ingia kwa kutumia alama za vidole au uso"
        checked={biometricEnabled}
        onCheckedChange={setBiometricEnabled}
      />

      <SettingsItem
        icon={<LogOut className="w-5 h-5 text-primary" />}
        title="Toka kwenye Vifaa Vyote"
        description="Funga akaunti kwenye vifaa vingine vyote"
        to="/mpangilio/logout-all"
      />

      <SettingsItem
        icon={<Smartphone className="w-5 h-5 text-primary" />}
        title="Vifaa Vilivyoingia"
        description="Angalia na simamia vifaa vilivyoingia"
        to="/mpangilio/devices"
      />
    </div>
  );
};

export default AccountSecuritySection;
