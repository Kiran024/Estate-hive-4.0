import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    // Check active session
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user || null);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);


  const signUp = async (email, password, metadata = {}) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.signUp(email, password, metadata);
      setUser(data.user);
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.signIn(email, password);
      setUser(data.user);
      // Don't navigate here - let the component handle it
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
      setUser(null);
      // Force reload to clear any cached data
      window.location.href = '/#/';
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
      // Force sign out even on error
      setUser(null);
      window.location.href = '/#/';
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.resetPassword(email);
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.updatePassword(newPassword);
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.updateProfile(updates);
      setUser(data.user);
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};