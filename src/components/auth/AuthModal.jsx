import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (mode === 'signup' && !formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          onClose();
          // Redirect to the page they were trying to access or home
          const from = location.state?.from || '/';
          navigate(from);
        } else {
          setErrors({ general: error.message });
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName
        });
        if (!error) {
          onClose();
          navigate('/confirmed');
        } else {
          setErrors({ general: error.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 pb-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center text-white">
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">
                {mode === 'signin' ? 'Welcome Back!' : 'Join Estate Hive'}
              </h2>
              <p className="text-white/90 text-sm">
                {mode === 'signin' 
                  ? 'Sign in to access exclusive properties'
                  : 'Create your account to get started'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 -mt-6">
            <div className="bg-white rounded-t-2xl pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Show general errors */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                    {errors.general}
                  </div>
                )}

                {/* Full Name (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
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
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === 'signin' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {/* Toggle Mode */}
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                    <button
                      type="button"
                      onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                      className="ml-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                    >
                      {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;