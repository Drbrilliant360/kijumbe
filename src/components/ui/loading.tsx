
import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
}

const Loading: React.FC<LoadingProps> = ({ size = "md" }) => {
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeMap[size]} relative animate-spin-slow`}>
        <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-gray-200"></div>
        <img 
          src="/lovable-uploads/a7730e30-4841-4e84-b261-c7a02ce07b27.png" 
          alt="Kijumbe Logo" 
          className="w-full h-full p-2 object-contain" 
        />
      </div>
    </div>
  );
};

export default Loading;
