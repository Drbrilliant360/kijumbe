
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage or query params
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Set up countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`verification-code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: "Tafadhali weka namba zote 6 za uthibitisho."
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Verify the OTP code with Supabase
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });

      if (error) throw error;

      toast({
        title: "Imefanikiwa!",
        description: "Barua pepe yako imethibitishwa kikamilifu.",
      });
      
      // Clear stored email and navigate to login
      localStorage.removeItem("verificationEmail");
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: error.message || "Kuna tatizo la uthibitisho. Tafadhali jaribu tena."
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || isResending) return;
    
    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Imetumwa!",
        description: "Namba mpya za uthibitisho zimetumwa kwenye barua pepe yako.",
      });
      
      // Set cooldown for resend button
      setCountdown(60);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: error.message || "Imeshindwa kutuma. Tafadhali jaribu tena baadaye."
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleUseNewEmail = () => {
    localStorage.removeItem("verificationEmail");
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6 p-4">
      <div className="bg-secondary rounded-full p-6 mb-2">
        <div className="w-12 h-12 flex items-center justify-center">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#2e7d32" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
        <p className="text-gray-600 text-sm px-6">
          We have sent a verification code to<br />
          <span className="font-medium">{email || "your email address"}</span>
        </p>
      </div>

      <div className="flex justify-between w-full gap-2 mb-4">
        {verificationCode.map((digit, index) => (
          <Input
            key={index}
            id={`verification-code-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-12 h-12 text-center text-xl rounded-lg"
          />
        ))}
      </div>

      <Button 
        onClick={handleVerify} 
        className="w-full py-6 bg-primary hover:bg-primary/90 text-white text-lg"
        disabled={isVerifying}
      >
        {isVerifying ? "Inathibitisha..." : "Verify Email"}
      </Button>

      <div className="flex items-center justify-center space-x-1 mt-2">
        <span className="text-gray-600 text-sm">Didn't receive the code?</span>
        <button 
          onClick={handleResend}
          className="text-primary text-sm font-medium hover:underline"
          disabled={countdown > 0 || isResending}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
        </button>
      </div>

      <button 
        onClick={handleUseNewEmail}
        className="text-primary font-medium hover:underline mt-6"
      >
        Use a different email
      </button>
    </div>
  );
};

export default EmailVerification;
