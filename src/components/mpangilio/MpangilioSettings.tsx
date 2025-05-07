
import { ChevronRight, KeyRound, Shield, Fingerprint, LogOut, Smartphone, 
  User, CreditCard, Languages, PaintBucket, RefreshCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MpangilioSettings = () => {
  const { userName, loading, userEmail } = useUserProfile();
  const [darkMode, setDarkMode] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    // Theme implementation would go here
  };

  const appVersion = "1.0.0";

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Mpangilio</h1>
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${userName || 'user'}`} alt={userName} />
            <AvatarFallback>{userName?.substring(0, 2) || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="text-xl font-medium">{loading ? "Loading..." : userName}</div>
          <p className="text-gray-600">{userEmail || "Loading email..."}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700 px-4">Akaunti & Usalama</h2>
        
        <SettingsItem
          icon={<KeyRound className="w-5 h-5 text-primary" />}
          title="Badilisha Nywila / PIN"
          description="Sanidi neno la siri au namba ya siri"
          to="/mpangilio/password"
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

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700 px-4">Maelezo Binafsi</h2>
        
        <SettingsItem
          icon={<User className="w-5 h-5 text-primary" />}
          title="Hariri Wasifu"
          description="Badilisha jina, barua pepe, na namba ya simu"
          to="/mpangilio/edit-profile"
        />

        <SettingsItem
          icon={<CreditCard className="w-5 h-5 text-primary" />}
          title="Akaunti za Benki"
          description="Simamia akaunti zako za benki"
          to="/mpangilio/bank-accounts"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700 px-4">Uzoefu wa Programu</h2>
        
        <SettingsItem
          icon={<Languages className="w-5 h-5 text-primary" />}
          title="Lugha"
          description="Chagua lugha unayopendelea"
          to="/mpangilio/language"
        />

        <SettingsToggleItem
          icon={<PaintBucket className="w-5 h-5 text-primary" />}
          title="Mandhari Nyeusi"
          description="Badilisha muonekano wa programu"
          checked={darkMode}
          onCheckedChange={handleThemeToggle}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700 px-4">Jumbe na Usaidizi</h2>
        
        <SettingsItemInfo
          icon={<RefreshCcw className="w-5 h-5 text-primary" />}
          title="Toleo la Programu"
          description={`Toleo ${appVersion}`}
        />

        <SettingsItem
          icon={<Trash2 className="w-5 h-5 text-primary" />}
          title="Futa Kache/Data"
          description="Safisha data iliyohifadhiwa kwenye kifaa"
          to="/mpangilio/clear-cache"
          variant="destructive"
        />
      </div>
    </div>
  );
};

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  variant?: "default" | "destructive";
}

const SettingsItem = ({ 
  icon, 
  title, 
  description, 
  to,
  variant = "default" 
}: SettingsItemProps) => {
  return (
    <Link to={to} className="block">
      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-secondary rounded-full p-3 mr-4">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${variant === "destructive" ? "text-red-600" : ""}`}>
            {title}
          </h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
};

interface SettingsItemInfoProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SettingsItemInfo = ({ icon, title, description }: SettingsItemInfoProps) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="bg-secondary rounded-full p-3 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
};

interface SettingsToggleItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const SettingsToggleItem = ({ 
  icon, 
  title, 
  description, 
  checked, 
  onCheckedChange 
}: SettingsToggleItemProps) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="bg-secondary rounded-full p-3 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};

export default MpangilioSettings;
