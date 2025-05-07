
import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <img 
        src="/lovable-uploads/a7730e30-4841-4e84-b261-c7a02ce07b27.png" 
        alt="Kijumbe Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;
