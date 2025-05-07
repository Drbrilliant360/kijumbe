
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserProfile = () => {
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Default to regular user

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
        .select('full_name, username, role')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results case

      if (error && error.code !== 'PGRST116') {
        // If there's an error other than "no rows", throw it
        throw error;
      }

      if (profile) {
        // If profile exists, use it
        setUserName(profile.full_name || profile.username || 'User');
        setIsAdmin(profile.role === 'admin'); // Check if user is admin
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
              role: 'user' // Default role is user
            });
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        } else {
          // Fallback to email or default
          setUserName(email?.split('@')[0] || 'User');
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

  return { userName, userEmail, loading, userId, isAdmin };
};
