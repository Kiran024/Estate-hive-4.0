import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../util/supabaseClient';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Home, ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check for error from navigation state
    if (location.state?.error) {
      setMessage(location.state.error);
      setSuccess(false);
    }

    // Store redirect path if provided
    if (location.state?.from) {
      localStorage.setItem('authRedirectTo', location.state.from);
    }

    // Handle OAuth callback
    if (window.location.hash && window.location.hash.includes('access_token')) {
      authService.handleOAuthCallback().then(() => {
        const from = localStorage.getItem('authRedirectTo') || location.state?.from || '/';
        localStorage.removeItem('authRedirectTo');
        navigate(from);
      });
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const from = localStorage.getItem('authRedirectTo') || location.state?.from || '/';
        localStorage.removeItem('authRedirectTo');
        navigate(from);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate, location]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      setMessage('Signed in successfully!');
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setMessage('Please accept the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    setMessage('');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/confirmed`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Account created! Please check your email to confirm.');
      setSuccess(true);
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
      setTermsAccepted(false);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithProvider('google');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      await authService.signInWithProvider('linkedin_oidc');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address first');
      return;
    }
    
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth-reset`,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset email sent! Check your inbox.');
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="max-w-md w-full space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <Link to="/">
              <img src="/EH_Logo.svg" alt="Estate Hive" className="h-16 mx-auto mb-6" />
            </Link>
            <h2 className="text-3xl font-bold" style={{ color: '#1B1B59' }}>
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp 
                ? 'Join Estate Hive to access exclusive properties' 
                : 'Sign in to continue to your account'}
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg text-sm ${
                success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <div className="space-y-4">
              {/* Full Name (Sign Up only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      required={isSignUp}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: '#1B1B59' }}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox (Sign Up only) */}
              {isSignUp && (
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded"
                    style={{ accentColor: '#1B1B59' }}
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="underline hover:opacity-80" style={{ color: '#1B1B59' }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="underline hover:opacity-80" style={{ color: '#1B1B59' }}>
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              {/* Forgot Password (Sign In only) */}
              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="font-medium hover:opacity-80 transition-opacity"
                      style={{ color: '#1B1B59' }}
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || (isSignUp && !termsAccepted)}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ backgroundColor: '#1B1B59' }}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                onClick={handleLinkedInSignIn}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#0077B5" d="M34,20.5v12.8h-7.3v-11.9c0-3-1.1-5-3.8-5c-2.1,0-3.3,1.4-3.8,2.8c-0.2,0.5-0.2,1.1-0.2,1.7v12.3H11.6c0,0,0.1-20,0-22.1h7.3v3.1c1-1.5,2.8-3.6,6.8-3.6C30.5,10.6,34,13.4,34,20.5z M3.8,0.5C1.7,0.5,0,2.1,0,4.1c0,2,1.6,3.6,3.8,3.6c2.2,0,3.7-1.6,3.8-3.6C7.6,2.1,6,0.5,3.8,0.5z M0.4,33.3H7V11.2H0.4V33.3z" />
                </svg>
                <span className="ml-2">LinkedIn</span>
              </button>
            </div>

            {/* Toggle Sign In/Up */}
            <div className="text-center text-sm">
              <span className="text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage('');
                  setSuccess(false);
                }}
                className="font-medium hover:opacity-80 transition-opacity"
                style={{ color: '#1B1B59' }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0" style={{ backgroundColor: '#1B1B59' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white text-center">
              <h3 className="text-4xl font-bold mb-4">Find Your Dream Property</h3>
              <p className="text-xl opacity-90 mb-8">
                Access exclusive listings and connect with verified property owners
              </p>
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Browse Exclusive Properties</h4>
                    <p className="text-sm opacity-80">Discover verified listings not available elsewhere</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Connect with Owners</h4>
                    <p className="text-sm opacity-80">Direct communication with property owners</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Save Your Favorites</h4>
                    <p className="text-sm opacity-80">Build your wishlist and track properties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;