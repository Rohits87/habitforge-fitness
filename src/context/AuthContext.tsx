import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  email: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferredWorkouts: string[];
  createdAt: Date;
  photoURL?: string; 
  age?: number; // Added age property as optional
  workoutDuration?: number; // Added workoutDuration as optional
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData && userData.user) {
            const authUser = userData.user;
            const metadata = authUser.user_metadata;
            
            const userObj: User = {
              id: authUser.id,
              name: metadata.name || 'User',
              email: authUser.email || '',
              fitnessLevel: (metadata.fitnessLevel as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
              goals: metadata.goals || [],
              preferredWorkouts: metadata.preferredWorkouts || [],
              createdAt: new Date(authUser.created_at),
              photoURL: metadata.photoURL,
              age: metadata.age,
              workoutDuration: metadata.workoutDuration,
            };
            
            setUser(userObj);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData && userData.user) {
          const authUser = userData.user;
          const metadata = authUser.user_metadata;
          
          const userObj: User = {
            id: authUser.id,
            name: metadata.name || 'User',
            email: authUser.email || '',
            fitnessLevel: (metadata.fitnessLevel as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
            goals: metadata.goals || [],
            preferredWorkouts: metadata.preferredWorkouts || [],
            createdAt: new Date(authUser.created_at),
            photoURL: metadata.photoURL,
            age: metadata.age,
            workoutDuration: metadata.workoutDuration,
          };
          
          setUser(userObj);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            fitnessLevel: 'beginner',
            goals: [],
            preferredWorkouts: [],
            createdAt: new Date(),
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: 'Account created',
        description: 'Please check your email for verification',
      });
      
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive',
      });
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: userData,
      });
      
      if (error) throw error;
      
      if (user) {
        setUser({
          ...user,
          ...userData,
        });
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'An error occurred while updating your profile',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
