
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Phone, Shield, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setProfileImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadProfileImage = async (userId: string) => {
    if (!profileImage) return null;

    const fileExt = profileImage.name.split('.').pop();
    const filePath = `${userId}/profile.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('profiles')
      .upload(filePath, profileImage, { upsert: true });

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Hitilafu!",
        description: "Kushindwa kupakia picha. Tafadhali jaribu tena baadaye."
      });
      return null;
    }

    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Upload profile image if selected
        let avatarUrl = null;
        if (profileImage) {
          avatarUrl = await uploadProfileImage(authData.user.id);
        }

        // Insert profile data including security question and answer
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            full_name: fullName,
            phone: phone,
            avatar_url: avatarUrl,
            security_question: securityQuestion,
            security_answer: securityAnswer,
            email_verified: true // Setting as true since we're bypassing email verification
          });

        if (profileError) {
          throw profileError;
        }

        toast({
          title: "Usajili Umefanikiwa!",
          description: "Karibu kwenye Kijumbe.",
        });

        // Sign in the user immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        
        navigate("/home");
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const securityQuestions = [
    "Jina la mnyama wako wa nyumbani wa kwanza?",
    "Jina la shule yako ya msingi?",
    "Jiji ulilozaliwa?",
    "Jina la mwalimu wako unayemkumbuka?",
    "Jina la rafiki wako wa utotoni?"
  ];

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
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center space-y-2">
          <div 
            onClick={triggerFileInput}
            className="w-24 h-24 rounded-full border-2 border-dashed border-primary flex items-center justify-center bg-secondary/20 cursor-pointer overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="h-8 w-8 text-primary" />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <span className="text-sm text-gray-500">Bofya kuweka picha ya wasifu</span>
        </div>

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

        {/* Security Question */}
        <div className="space-y-2">
          <label htmlFor="securityQuestion" className="text-lg font-medium">Swali la Usalama</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <Select value={securityQuestion} onValueChange={setSecurityQuestion} required>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Chagua swali la usalama" />
              </SelectTrigger>
              <SelectContent>
                {securityQuestions.map((question, index) => (
                  <SelectItem key={index} value={question}>
                    {question}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Security Answer */}
        <div className="space-y-2">
          <label htmlFor="securityAnswer" className="text-lg font-medium">Jibu la Usalama</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              id="securityAnswer"
              placeholder="Jibu lako la siri"
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
