
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Wallet, User, Settings } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/home') {
      return path === '/home';
    }
    if (route === '/vikundi') {
      return path.startsWith('/vikundi');
    }
    if (route === '/malipo') {
      return path.startsWith('/malipo');
    }
    if (route === '/profile') {
      return path.startsWith('/profile');
    }
    if (route === '/mpangilio') {
      return path.startsWith('/mpangilio');
    }
    return false;
  };

  const handleNavigation = (route: string) => {
    if (route === '/home' && (path === '/login' || path === '/')) {
      navigate('/home');
    } else {
      navigate(route);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center p-2">
        <NavItem 
          onClick={() => handleNavigation('/home')}
          icon={<Home className={`w-6 h-6 ${isActive('/home') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Mwanzo" 
          isActive={isActive('/home')} 
        />
        <NavItem 
          onClick={() => handleNavigation('/vikundi')}
          icon={<Users className={`w-6 h-6 ${isActive('/vikundi') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Vikundi" 
          isActive={isActive('/vikundi')} 
        />
        <NavItem 
          onClick={() => handleNavigation('/malipo')}
          icon={<Wallet className={`w-6 h-6 ${isActive('/malipo') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Malipo" 
          isActive={isActive('/malipo')} 
        />
        <NavItem 
          onClick={() => handleNavigation('/profile')}
          icon={<User className={`w-6 h-6 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Wasifu" 
          isActive={isActive('/profile')} 
        />
        <NavItem 
          onClick={() => handleNavigation('/mpangilio')}
          icon={<Settings className={`w-6 h-6 ${isActive('/mpangilio') ? 'text-primary' : 'text-gray-500'}`} />} 
          label="Mpangilio" 
          isActive={isActive('/mpangilio')} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button onClick={onClick} className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center">
        {icon}
        <span className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
    </button>
  );
};

export default Navbar;
