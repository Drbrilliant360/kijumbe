
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
    <div className={`bg-secondary rounded-full ${className}`}>
      <div className={`${sizeMap[size]} p-2 flex items-center justify-center`}>
        <div className="bg-primary rounded-md w-full h-full flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-white rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
