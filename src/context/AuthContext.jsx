import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, auth as supabaseAuth } from '../lib/supabase';

// Create auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user profile from profiles table
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  };

  // Check auth status when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data, error } = await supabaseAuth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session?.user) {
          setUser(data.session.user);
          
          // Fetch user profile data
          const profileData = await fetchUserProfile(data.session.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate user');
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          // Fetch user profile data
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    checkAuthStatus();

    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabaseAuth.signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        setUser(data.user);
        
        // Fetch user profile data
        const profileData = await fetchUserProfile(data.user.id);
        if (profileData) {
          setProfile(profileData);
        }
        
        return data.user;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email, password, profileData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabaseAuth.signUp(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              first_name: profileData.firstName || '',
              last_name: profileData.lastName || '',
              phone_number: profileData.phoneNumber || '',
              is_admin: false,
              created_at: new Date(),
              updated_at: new Date()
            }
          ]);
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Consider handling this case - maybe delete the auth user?
        }
        
        return data.user;
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabaseAuth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!user || !profile) {
      setError('No authenticated user');
      return null;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date()
        })
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has admin role
  const isAdmin = () => {
    return profile?.is_admin === true;
  };

  // Provide auth context value
  const value = {
    user,
    profile,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAdmin,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;