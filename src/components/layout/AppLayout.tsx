
import React from "react";
import Navbar from "./Navbar";
import { useTheme } from "@/context/ThemeContext";

interface AppLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  hideNavbar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  header,
  hideNavbar = false
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      {header && <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>{header}</div>}
      <div className="container mx-auto px-4 py-4">{children}</div>
      {!hideNavbar && <Navbar />}
    </div>
  );
};

export default AppLayout;
