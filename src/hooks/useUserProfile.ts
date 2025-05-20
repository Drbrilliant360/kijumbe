
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserProfile {
  securityQuestion: string | null;
  securityAnswer: string | null;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  userId: string;
}

export const useUserProfile = () => {
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      setUserId(user.id);
      setUserEmail(user.email || "");

      // First, try to get the user's profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, username, role, security_question, security_answer, phone')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        // If there's an error other than "no rows", throw it
        throw error;
      }

      if (profile) {
        // If profile exists, use it
        setUserName(profile.full_name || profile.username || 'User');
        setIsAdmin(profile.role === 'admin');
        
        setUserProfile({
          securityQuestion: profile.security_question || null,
          securityAnswer: profile.security_answer || null,
          fullName: profile.full_name || null,
          email: user.email || null,
          phoneNumber: profile.phone || null,
          userId: user.id
        });
      } else {
        // If no profile exists, create one using user metadata
        const fullName = user.user_metadata?.full_name;
        const email = user.email;
        
        if (fullName) {
          // Use the user's metadata to extract a name
          setUserName(fullName);
          
          // Create a profile for this user
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: fullName,
              username: email?.split('@')[0] || 'user',
              email_verified: user.email_confirmed_at ? true : false,
              role: 'user'
            });
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
          
          setUserProfile({
            securityQuestion: null,
            securityAnswer: null,
            fullName: fullName,
            email: email || null,
            phoneNumber: null,
            userId: user.id
          });
        } else {
          // Fallback to email or default
          setUserName(email?.split('@')[0] || 'User');
          
          setUserProfile({
            securityQuestion: null,
            securityAnswer: null,
            fullName: null,
            email: email || null,
            phoneNumber: null,
            userId: user.id
          });
        }
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user profile"
      });
    } finally {
      setLoading(false);
    }
  };

  return { 
    userName, 
    userEmail, 
    loading, 
    userId, 
    isAdmin, 
    userProfile, 
    fetchUserData
  };
};
