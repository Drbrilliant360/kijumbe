
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Verification Bypassed",
      description: "Email verification has been disabled. Redirecting to home page.",
    });
    
    // Redirect to home after a short delay
    const timer = setTimeout(() => {
      navigate("/home");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-2xl font-bold text-center">Redirecting...</h1>
      <p className="text-gray-600 text-center mt-2">You will be redirected to the home page.</p>
    </div>
  );
};

export default EmailVerification;
