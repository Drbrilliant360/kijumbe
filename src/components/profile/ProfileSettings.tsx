
import { ChevronRight, User, Bell, Lock, HelpCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfileSettings = () => {
  const { userName, loading, userEmail, isAdmin } = useUserProfile();

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Wasifu</h1>
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${userName || 'user'}`} alt={userName} />
            <AvatarFallback>{userName?.substring(0, 2) || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="text-xl font-medium">{loading ? "Loading..." : userName}</div>
          <p className="text-gray-600">{userEmail || "Loading email..."}</p>
          
          <div className="flex items-center justify-center gap-1 text-primary mt-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span className="text-sm">{isAdmin ? "Kijumbe (Admin)" : "Mtumiaji (User)"}</span>
          </div>
        </div>
      </div>

      <SettingsItem
        icon={<User className="w-5 h-5 text-primary" />}
        title="Taarifa Zangu"
        description="Tazama na hariri taarifa zako za msingi"
        to="/profile/personal"
      />

      <SettingsItem
        icon={<Bell className="w-5 h-5 text-primary" />}
        title="Notifications"
        description="Simamia arifa na vipaumbele"
        to="/profile/notifications"
      />

      <SettingsItem
        icon={<Lock className="w-5 h-5 text-primary" />}
        title="Usalama"
        description="Badilisha nywila na angalia akaunti"
        to="/profile/security"
      />

      <SettingsItem
        icon={<HelpCircle className="w-5 h-5 text-primary" />}
        title="Msaada"
        description="Maswali yanayoulizwa mara kwa mara na msaada"
        to="/profile/help"
      />

      <SettingsItem
        icon={<Info className="w-5 h-5 text-primary" />}
        title="Kuhusu"
        description="Soma kuhusu programu hii"
        to="/profile/about"
      />
    </div>
  );
};

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

const SettingsItem = ({ icon, title, description, to }: SettingsItemProps) => {
  return (
    <Link to={to} className="block">
      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-secondary rounded-full p-3 mr-4">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
};

export default ProfileSettings;
