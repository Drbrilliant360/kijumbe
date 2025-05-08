
import UserProfileHeader from "./UserProfileHeader";
import AccountSecuritySection from "./sections/AccountSecuritySection";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import AppExperienceSection from "./sections/AppExperienceSection";
import AppInfoSection from "./sections/AppInfoSection";

const MpangilioSettings = () => {
  return (
    <div className="space-y-4">
      <UserProfileHeader />

      <AccountSecuritySection />
      
      <PersonalInfoSection />
      
      <AppExperienceSection />
      
      <AppInfoSection />
    </div>
  );
};

export default MpangilioSettings;
