
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/ui/logo";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Umefanikiwa Kuingia!",
        description: "Karibu tena kwenye akaunti yako.",
      });

      navigate("/home");
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
      <Logo size="lg" className="mb-4" />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Karibu kwa Kijumbe</h1>
        <p className="text-gray-600">Login to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-lg font-medium">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="email"
              id="email"
              placeholder="weka email yako"
              className="pl-10 rounded-lg border-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-lg font-medium">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="password"
              id="password"
              placeholder="••••••"
              className="pl-10 rounded-lg border-gray-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full py-6 bg-primary hover:bg-primary/90 text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Inaingia..." : "Login"}
        </Button>
      </form>

      <div className="flex items-center justify-center space-x-1 mt-6">
        <span className="text-gray-600">Don't have an account?</span>
        <Link to="/register" className="text-primary font-medium hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
