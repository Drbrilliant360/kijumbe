
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/ui/loading";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page after a short delay to show loading animation
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loading size="lg" />
      <h2 className="text-2xl font-bold mt-8 text-primary">KIJUMBE</h2>
      <p className="text-gray-600 mt-2">Loading...</p>
    </div>
  );
};

export default Index;
