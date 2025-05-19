
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if email exists in our database
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .maybeSingle();

      if (error || !data) {
        throw new Error("Barua pepe haipatikani katika mfumo wetu.");
      }
      
      // Use Supabase's built-in password reset functionality
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) throw resetError;

      toast({
        title: "Ombi Limetumwa!",
        description: "Tafadhali angalia barua pepe yako kwa maelekezo ya kubadilisha nywila.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6 p-4">
      <div className="bg-secondary rounded-full p-8 mb-4">
        <div className="w-16 h-16 bg-primary rounded-md flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-sm m-1"></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Umesahau Nywila?</h1>
        <p className="text-gray-600">
          Ingiza barua pepe yako kupata msaada
        </p>
      </div>

      <form onSubmit={handleSubmitEmail} className="w-full space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-lg font-medium">Barua pepe</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="email"
              id="email"
              placeholder="Barua pepe yako"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full py-6 bg-primary hover:bg-primary/90 text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Inatuma..." : "Tuma"}
        </Button>
      </form>

      <div className="flex items-center justify-center space-x-1 mt-6">
        <span className="text-gray-600">Umekumbuka nywila?</span>
        <Link to="/login" className="text-primary font-medium hover:underline">
          Ingia
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
