
import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";

const SecurityQuestion = () => {
  const { t } = useTranslations();
  const { userProfile, loading, userId, fetchUserData } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      securityQuestion: "",
      securityAnswer: "",
    }
  });

  useEffect(() => {
    // When userProfile is loaded, update form values
    if (userProfile?.securityQuestion) {
      form.setValue("securityQuestion", userProfile.securityQuestion);
    }
    if (userProfile?.securityAnswer) {
      form.setValue("securityAnswer", userProfile.securityAnswer);
    }
  }, [userProfile, form]);

  const onSubmit = async (values: { securityQuestion: string; securityAnswer: string }) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Hitilafu",
        description: "Tafadhali ingia kwanza"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          security_question: values.securityQuestion,
          security_answer: values.securityAnswer
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Imefanikiwa",
        description: "Swali la usalama limehifadhiwa"
      });
      
      // Refresh user profile data
      fetchUserData();
    } catch (error: any) {
      console.error("Error updating security question:", error);
      toast({
        variant: "destructive",
        title: "Hitilafu",
        description: error.message || "Imeshindwa kuhifadhi swali la usalama"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">Swali la Usalama</h1>
    </div>
  );
  
  if (loading) {
    return (
      <AppLayout header={Header}>
        <div className="flex justify-center items-center h-64">
          <p>Inapakia...</p>
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
            Weka swali la usalama kwa ajili ya kurejeshea akaunti yako
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="securityQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swali la Usalama</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Mfano: Jina la shule yangu ya kwanza?" 
                        {...field} 
                        required
                      />
                    </FormControl>
                    <FormDescription>
                      Chagua swali ambalo ni rahisi kwako kukumbuka jibu lake
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="securityAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jibu la Swali la Usalama</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Jibu lako" 
                        {...field} 
                        required
                      />
                    </FormControl>
                    <FormDescription>
                      Jibu hili litatumika kuthibitisha utambulisho wako
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Inahifadhi..." : "Hifadhi Swali"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default SecurityQuestion;
