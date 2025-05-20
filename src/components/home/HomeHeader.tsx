
import { Bell, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HomeHeaderProps {
  userName: string;
  isLoading?: boolean;
}

const HomeHeader = ({ userName, isLoading = false }: HomeHeaderProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <Link to="/profile" className="flex items-center group">
          <div 
            className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mr-3 group-hover:bg-primary/10 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className={`font-bold transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-gray-600'}`}>
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">Habari {userName}</h2>
            <p className="text-gray-500 text-sm">Karibu Kijumbe App</p>
          </div>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default HomeHeader;
