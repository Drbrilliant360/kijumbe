
import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

const SecurityQuestion = () => {
  const { t } = useTranslations();
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userProfile, isLoading: profileLoading } = useUserProfile();
  
  useEffect(() => {
    if (userProfile?.security_question) {
      setSecurityQuestion(userProfile.security_question);
    }
  }, [userProfile]);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          security_question: securityQuestion,
          security_answer: securityAnswer,
        })
        .eq('user_id', userProfile?.user_id);
      
      if (error) throw error;
      
      toast.success("Swali la usalama limehifadhiwa!");
      navigate('/mpangilio');
    } catch (error: any) {
      toast.error(error.message || "Hitilafu imetokea wakati wa kuhifadhi swali la usalama.");
    } finally {
      setIsLoading(false);
    }
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('securityQuestionTitle')}</h1>
    </div>
  );
  
  if (profileLoading) {
    return (
      <AppLayout header={Header}>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Swali la Usalama</h2>
          <p className="text-gray-500 text-center">
            Weka swali la usalama kwa ajili ya kurejesha akaunti yako.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="security-question" className="block text-sm font-medium">
              Swali la Usalama
            </label>
            <Input
              id="security-question"
              type="text"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
              placeholder="Mfano: Jina la shule yangu ya msingi?"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Chagua swali ambalo ni rahisi kwako kukumbuka lakini ni gumu kwa mtu mwingine kubahatisha.
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="security-answer" className="block text-sm font-medium">
              Jibu la Usalama
            </label>
            <Input
              id="security-answer"
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
              placeholder="Jibu lako"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Hakikisha unaingiza jibu ambalo utakumbuka wakati wa kuomba kurejeshewa nywila.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !securityQuestion || !securityAnswer}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Inahifadhi...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Hifadhi Swali la Usalama
                </>
              )}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium mb-2 text-blue-800">Kumbuka</h3>
          <p className="text-sm text-blue-700">
            Swali la usalama litakusaidia kuingia kwenye akaunti yako ikiwa utasahau nywila. Hakikisha unahifadhi jibu mahali salama.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default SecurityQuestion;
