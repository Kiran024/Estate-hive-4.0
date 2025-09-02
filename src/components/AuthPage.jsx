import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../util/supabaseClient';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Phone, ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFlipped, setIsFlipped] = useState(location.state?.isSignUp || false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
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
        // After email verification or magic link: go to Sign In page
        localStorage.removeItem('authRedirectTo');
        navigate('/auth');
      });
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        if (window.location.hash && window.location.hash.includes('access_token')) {
          // Email verification or magic link: land on Sign In page
          localStorage.removeItem('authRedirectTo');
          navigate('/auth');
          return;
        }
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
        data: { full_name: fullName, phone: phone },
        // After email verify, open the Sign In (Welcome Back) page
        emailRedirectTo: `${window.location.origin}/#/auth`,
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
      setPhone('');
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
      // Open dedicated reset password page in the SPA
      redirectTo: `${window.location.origin}/#/auth-reset`,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset email sent! Check your inbox.');
      setSuccess(true);
    }
    setLoading(false);
  };

  const cardStyle = {
    perspective: '1000px',
  };

  const flipperStyle = {
    transition: 'transform 0.7s',
    transformStyle: 'preserve-3d',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  };

  const faceStyle = {
    position: 'absolute',
    width: '100%',
    backfaceVisibility: 'hidden',
  };

  const backStyle = {
    ...faceStyle,
    transform: 'rotateY(180deg)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 px-4 py-8 relative">
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md z-10 border border-gray-100"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs sm:text-sm font-medium">Back to Home</span>
      </Link>

      <div className="relative w-full max-w-md mx-auto" style={cardStyle}>
        <div className="relative w-full min-h-[700px] sm:min-h-[750px]" style={flipperStyle}>
          
          {/* ---- Login Card (Front) ---- */}
          <div className="w-full flex items-center justify-center min-h-[700px] sm:min-h-[750px]" style={faceStyle}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 w-full mx-4 sm:mx-0"
            >
              <img src="/EH_Logo.svg" alt="Estate Hive" className="mx-auto h-12 sm:h-14 mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 text-center font-medium">
                Unlock Your Dream Property
              </p>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center"
                  >
                    ✅ {message || 'Login Successful! Redirecting...'}
                  </motion.div>
                )}
                {message && !success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Login Buttons */}
              <button 
                onClick={handleGoogleSignIn} 
                className="w-full bg-white border-2 border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200 text-gray-700 py-2.5 sm:py-3 rounded-xl mb-3 flex items-center justify-center text-sm sm:text-base font-medium"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
                Sign in with Google
              </button>

              <button 
                onClick={handleLinkedInSignIn} 
                className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-gray-700 py-2.5 sm:py-3 rounded-xl mb-4 flex items-center justify-center text-sm sm:text-base font-medium"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#0077B5" d="M34,20.5v12.8h-7.3v-11.9c0-3-1.1-5-3.8-5c-2.1,0-3.3,1.4-3.8,2.8c-0.2,0.5-0.2,1.1-0.2,1.7v12.3H11.6c0,0,0.1-20,0-22.1h7.3v3.1c1-1.5,2.8-3.6,6.8-3.6C30.5,10.6,34,13.4,34,20.5z M3.8,0.5C1.7,0.5,0,2.1,0,4.1c0,2,1.6,3.6,3.8,3.6c2.2,0,3.7-1.6,3.8-3.6C7.6,2.1,6,0.5,3.8,0.5z M0.4,33.3H7V11.2H0.4V33.3z" />
                </svg>
                Sign in with LinkedIn
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-3 text-gray-400 text-sm font-medium">or</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSignIn}>
                <div className="relative mb-3 sm:mb-4">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative mb-3 sm:mb-4">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password" 
                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={handleForgotPassword} 
                  className="text-indigo-600 text-sm hover:text-indigo-700 font-medium block mb-4 hover:underline transition-colors"
                >
                  Forgot password?
                </button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 mb-4 flex justify-center items-center font-semibold shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>

              <p className="text-sm text-center text-gray-600 mt-6">
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsFlipped(true)} 
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </motion.div>
          </div>

          {/* ---- Sign Up Card (Back) ---- */}
          <div className="w-full flex items-center justify-center min-h-[700px] sm:min-h-[750px]" style={backStyle}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 w-full mx-4 sm:mx-0"
            >
              <img src="/EH_Logo.svg" alt="Estate Hive" className="mx-auto h-12 sm:h-14 mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 text-center font-medium">
                Join Estate Hive Today
              </p>

              {/* Success/Error Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg text-sm text-center ${
                      success 
                        ? 'bg-green-50 border border-green-200 text-green-700' 
                        : 'bg-red-50 border border-red-200 text-red-600'
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Signup Buttons */}
              <button 
                onClick={handleGoogleSignIn} 
                className="w-full bg-white border-2 border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200 text-gray-700 py-2.5 sm:py-3 rounded-xl mb-3 flex items-center justify-center text-sm sm:text-base font-medium"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
                Sign up with Google
              </button>

              <button 
                onClick={handleLinkedInSignIn} 
                className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-gray-700 py-2.5 sm:py-3 rounded-xl mb-4 flex items-center justify-center text-sm sm:text-base font-medium"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#0077B5" d="M34,20.5v12.8h-7.3v-11.9c0-3-1.1-5-3.8-5c-2.1,0-3.3,1.4-3.8,2.8c-0.2,0.5-0.2,1.1-0.2,1.7v12.3H11.6c0,0,0.1-20,0-22.1h7.3v3.1c1-1.5,2.8-3.6,6.8-3.6C30.5,10.6,34,13.4,34,20.5z M3.8,0.5C1.7,0.5,0,2.1,0,4.1c0,2,1.6,3.6,3.8,3.6c2.2,0,3.7-1.6,3.8-3.6C7.6,2.1,6,0.5,3.8,0.5z M0.4,33.3H7V11.2H0.4V33.3z" />
                </svg>
                Sign up with LinkedIn
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-3 text-gray-400 text-sm font-medium">or</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignUp}>
                <div className="relative mb-3">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="relative mb-3">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative mb-3">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password" 
                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative mb-3 sm:mb-4">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    placeholder="Phone Number (Optional)" 
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start mb-4">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 sm:mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: loading || !termsAccepted ? 1 : 1.02 }}
                  whileTap={{ scale: loading || !termsAccepted ? 1 : 0.98 }}
                  className={`w-full py-3 rounded-xl transition-all duration-200 mb-4 flex justify-center items-center font-semibold shadow-lg ${
                    termsAccepted 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={loading || !termsAccepted}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </form>

              <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account?{' '}
                <button 
                  onClick={() => setIsFlipped(false)} 
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
