
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home as HomeIcon, 
  CreditCard, 
  Users, 
  User, 
  Settings,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/home' && currentPath === '/home') return true;
    if (path !== '/home' && currentPath.startsWith(path)) return true;
    return false;
  };
  
  const navItems = [
    {
      label: 'Nyumbani',
      icon: HomeIcon,
      path: '/home'
    },
    {
      label: 'Malipo',
      icon: CreditCard,
      path: '/malipo'
    },
    {
      label: 'Vikundi',
      icon: Users,
      path: '/vikundi'
    },
    {
      label: 'Uliza',
      icon: MessageSquare,
      path: '/uliza'
    },
    {
      label: 'Mpangilio',
      icon: Settings,
      path: '/mpangilio'
    },
  ];
  
  return (
    <nav className="bg-background border-t fixed bottom-0 left-0 right-0 h-16 z-50">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className={cn(
              "h-5 w-5 mb-1",
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            )} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
