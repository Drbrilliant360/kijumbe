
import React from "react";
import Navbar from "./Navbar";

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
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {header && <div className="bg-white shadow-sm">{header}</div>}
      <div className="container mx-auto px-4 py-4">{children}</div>
      {!hideNavbar && <Navbar />}
    </div>
  );
};

export default AppLayout;
