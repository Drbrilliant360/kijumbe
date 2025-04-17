
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);

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

  const handleVerify = () => {
    // Handle verification logic here
    const code = verificationCode.join("");
    console.log("Verifying with code:", code);
  };

  const handleResend = () => {
    // Handle resend logic here
    console.log("Resending verification code");
  };

  const handleUseNewEmail = () => {
    // Handle change email logic here
    console.log("Using a different email");
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
          <span className="font-medium">hxcpaxvgxzdodpnces@hthlm.com</span>
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
      >
        Verify Email
      </Button>

      <div className="flex items-center justify-center space-x-1 mt-2">
        <span className="text-gray-600 text-sm">Didn't receive the code?</span>
        <button 
          onClick={handleResend}
          className="text-primary text-sm font-medium hover:underline"
        >
          Resend
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
