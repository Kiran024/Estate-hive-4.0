import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../util/supabaseClient';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          // Exchange the access token for a session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            navigate('/auth', { state: { error: 'Authentication failed. Please try again.' } });
            return;
          }

          if (data.session) {
            // Successfully authenticated
            // Check if there's a redirect path stored
            const redirectTo = localStorage.getItem('authRedirectTo') || '/';
            localStorage.removeItem('authRedirectTo');
            
            // Navigate to the intended page or home
            navigate(redirectTo, { replace: true });
          } else {
            // No session found
            navigate('/auth', { state: { error: 'No session found. Please sign in again.' } });
          }
        } else {
          // No access token in URL, check if we have an error
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');
          
          if (error) {
            console.error('OAuth error:', error, errorDescription);
            navigate('/auth', { 
              state: { 
                error: errorDescription || 'Authentication failed. Please try again.' 
              } 
            });
          } else {
            // No token and no error, redirect to auth page
            navigate('/auth');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth', { 
          state: { 
            error: 'An unexpected error occurred. Please try again.' 
          } 
        });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing Sign In...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;