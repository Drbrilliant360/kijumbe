
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/use-translations";
import Logo from "@/components/ui/logo";

type ResetStep = "email" | "security" | "success";

interface ProfileData {
  user_id?: string;
  security_question?: string | null;
  security_answer?: string | null;
}

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
  const [step, setStep] = useState<ResetStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if email exists in our database
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, security_question, security_answer')
        .eq('username', email.split('@')[0])
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        throw new Error("Barua pepe haipatikani katika mfumo wetu.");
      }
      
      // Store the security question
      setSecurityQuestion(data.security_question || null);
      
      // If we have a security question, move to the security step
      if (data.security_question) {
        setStep("security");
      } else {
        // If no security question, use Supabase's built-in password reset functionality
        await handlePasswordReset();
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

  const handleVerifySecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify security answer
      const { data, error } = await supabase
        .from('profiles')
        .select('security_answer')
        .eq('username', email.split('@')[0])
        .maybeSingle();

      if (error) throw error;
      
      if (!data || !data.security_answer) {
        throw new Error("Hitilafu imetokea wakati wa kuthibitisha.");
      }

      // Simple case-insensitive comparison for security answer
      if (data.security_answer.toLowerCase() !== securityAnswer.toLowerCase()) {
        throw new Error("Jibu la usalama si sahihi.");
      }

      // Security answer is correct, proceed with password reset
      await handlePasswordReset();
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

  const handlePasswordReset = async () => {
    try {
      // Use Supabase's built-in password reset functionality
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      setStep("success");
      toast({
        title: "Ombi Limetumwa!",
        description: "Tafadhali angalia barua pepe yako kwa maelekezo ya kubadilisha nywila.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6 p-4">
      <div className="bg-secondary rounded-full p-8 mb-4">
        <Logo size="md" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Umesahau Nywila?</h1>
        <p className="text-gray-600">
          {step === "email" && "Ingiza barua pepe yako kupata msaada"}
          {step === "security" && "Jibu swali la usalama lako"}
          {step === "success" && "Ombi lako limetumwa"}
        </p>
      </div>

      {step === "email" && (
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

      {step === "security" && securityQuestion && (
        <form onSubmit={handleVerifySecurity} className="w-full space-y-4">
          <div className="space-y-2">
            <label htmlFor="securityQuestion" className="text-lg font-medium">Swali la Usalama</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                id="securityQuestion"
                value={securityQuestion}
                className="pl-10"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="securityAnswer" className="text-lg font-medium">Jibu la Usalama</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                id="securityAnswer"
                placeholder="Jibu lako"
                className="pl-10"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 bg-primary hover:bg-primary/90 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Inathibitisha..." : "Thibitisha"}
          </Button>
        </form>
      )}

      {step === "success" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-green-100 text-green-500 rounded-full p-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-lg">Barua pepe ya kubadilisha nywila imetumwa! Tafadhali angalia barua pepe yako.</p>
          <Button 
            className="w-full py-6 bg-primary hover:bg-primary/90 text-lg"
            onClick={() => navigate("/login")}
          >
            Rudi kwenye ukurasa wa kuingia
          </Button>
        </div>
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
