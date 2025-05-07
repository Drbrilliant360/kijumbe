
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Wallet, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    return path === route;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center p-2">
        <NavItem 
          to="/" 
          icon={<Home className={`w-6 h-6 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Mwanzo" 
          isActive={isActive('/')} 
        />
        <NavItem 
          to="/vikundi" 
          icon={<Users className={`w-6 h-6 ${isActive('/vikundi') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Vikundi" 
          isActive={isActive('/vikundi')} 
        />
        <NavItem 
          to="/malipo" 
          icon={<Wallet className={`w-6 h-6 ${isActive('/malipo') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Malipo" 
          isActive={isActive('/malipo')} 
        />
        <NavItem 
          to="/profile" 
          icon={<User className={`w-6 h-6 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Wasifu" 
          isActive={isActive('/profile')} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link to={to} className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center">
        {icon}
        <span className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Navbar;
