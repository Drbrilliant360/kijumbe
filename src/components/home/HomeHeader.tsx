
import { Bell } from "lucide-react";

interface HomeHeaderProps {
  userName: string;
  isLoading?: boolean;
}

const HomeHeader = ({ userName = "", isLoading = false }: HomeHeaderProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <span className="text-primary font-bold">
              {userName ? userName.charAt(0) : "?"}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-lg">
              {isLoading ? "Loading..." : `Habari ${userName || "User"}`}
            </h2>
            <p className="text-gray-500 text-sm">Karibu Kijumbe App</p>
          </div>
        </div>
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default HomeHeader;
