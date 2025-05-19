
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Answer Security Question, 3: Reset Password
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        .single();

      if (error || !data) {
        throw new Error("Barua pepe haipatikani katika mfumo wetu.");
      }
      
      // Get security question if it exists
      const { data: securityData } = await supabase
        .from('profiles')
        .select('security_question')
        .eq('email', email)
        .maybeSingle();
      
      const question = securityData?.security_question;
      
      if (question) {
        setSecurityQuestion(question);
        setStep(2);
      } else {
        // If no security question, allow direct password reset
        setStep(3);
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

  const handleVerifySecurityAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if the security answer matches
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .eq('security_answer', securityAnswer)
        .maybeSingle();

      if (error || !data) {
        throw new Error("Jibu la swali la usalama si sahihi.");
      }

      setStep(3);
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: "Nywila hazifanani.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Get user's auth info from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .maybeSingle();

      if (error || !data) {
        throw new Error("Tatizo limetokea kupata taarifa za mtumiaji.");
      }

      // Reset password using supabase auth API
      const { error: resetError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (resetError) throw resetError;

      toast({
        title: "Nywila Imebadilishwa!",
        description: "Nywila yako imebadilishwa kikamilifu. Tafadhali ingia kwa kutumia nywila mpya.",
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
          {step === 1 && "Ingiza barua pepe yako kupata msaada"}
          {step === 2 && "Jibu swali la usalama"}
          {step === 3 && "Weka nywila mpya"}
        </p>
      </div>

      {step === 1 && (
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
      )}

      {step === 2 && (
        <form onSubmit={handleVerifySecurityAnswer} className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-lg font-medium">Swali la Usalama</label>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>{securityQuestion}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="securityAnswer" className="text-lg font-medium">Jibu</label>
            <Input
              type="text"
              id="securityAnswer"
              placeholder="Jibu lako la usalama"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline"
              className="flex-1 py-6"
              onClick={() => setStep(1)}
            >
              Rudi
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-6 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Inaangalia..." : "Thibitisha"}
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="w-full space-y-4">
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-lg font-medium">Nywila Mpya</label>
            <Input
              type="password"
              id="newPassword"
              placeholder="••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-lg font-medium">Thibitisha Nywila</label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline"
              className="flex-1 py-6"
              onClick={() => setStep(step > 1 ? step - 1 : 1)}
            >
              Rudi
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-6 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Inabadilisha..." : "Badilisha Nywila"}
            </Button>
          </div>
        </form>
      )}

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
