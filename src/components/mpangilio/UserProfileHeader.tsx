
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";

const UserProfileHeader = () => {
  const { userName, loading, userEmail } = useUserProfile();
  
  return (
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
  );
};

export default UserProfileHeader;
