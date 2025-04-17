
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: authData.user.id,
              full_name: fullName,
              phone: phone,
            }
          ]);

        if (profileError) throw profileError;

        toast({
          title: "Usajili Umefanikiwa!",
          description: "Tafadhali thibitisha barua pepe yako.",
        });

        navigate("/verification");
      }
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
        <h1 className="text-3xl font-bold mb-2">Karibu kwenye Kijumbe</h1>
        <p className="text-gray-600">Jisajili kupata akaunti mpya</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-lg font-medium">Jina Kamili</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              id="fullName"
              placeholder="Jina kamili"
              className="pl-10"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-lg font-medium">Namba ya Simu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="tel"
              id="phone"
              placeholder="0712345678"
              className="pl-10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

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

        <div className="space-y-2">
          <label htmlFor="password" className="text-lg font-medium">Nywila</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="password"
              id="password"
              placeholder="••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full py-6 bg-primary hover:bg-primary/90 text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Inaandikisha..." : "Jisajili"}
        </Button>
      </form>

      <div className="flex items-center justify-center space-x-1 mt-6">
        <span className="text-gray-600">Una akaunti tayari?</span>
        <Link to="/login" className="text-primary font-medium hover:underline">
          Ingia
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
