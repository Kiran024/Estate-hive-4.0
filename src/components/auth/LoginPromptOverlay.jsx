import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Lock, Eye, Home, Shield, Sparkles, X } from 'lucide-react';

const LoginPromptOverlay = ({ 
  children, 
  showOverlay = true, 
  title = "Unlock Premium Properties",
  subtitle = "Sign in to view exclusive property details and connect with verified owners"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  if (!showOverlay) return children;

  return (
    <div className="relative min-h-screen">
      {/* Blurred Content Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full filter blur-md scale-105 opacity-60">
          {children}
        </div>
      </div>

      {/* Glassmorphism Overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/50 to-gray-900/40 backdrop-blur-sm"
        >
          {/* Animated Background Patterns */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* Main Content Card */}
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative max-w-md w-full"
            >
              {/* Glass Card */}
              <div 
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Lock Icon with Animation */}
                <motion.div 
                  className="flex justify-center mb-6"
                  animate={{ 
                    rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                    scale: isHovered ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-xl opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-5">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Title and Subtitle */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h2>
                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                  {subtitle}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <motion.div 
                    className="flex items-center gap-3 text-gray-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">View complete property details & photos</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-gray-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">Access verified & exclusive properties</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-gray-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">Connect directly with property owners</span>
                  </motion.div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link 
                    to="/auth" 
                    state={{ from: location.pathname }}
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Sign In to Continue
                    </motion.button>
                  </Link>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-xs text-gray-500 px-2">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  <Link 
                    to="/auth" 
                    state={{ from: location.pathname, isSignUp: true }}
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 font-semibold py-3.5 px-6 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                    >
                      Create Free Account
                    </motion.button>
                  </Link>
                </div>

                {/* Home Link */}
                <div className="mt-6 text-center">
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-3 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  PREMIUM ACCESS
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPromptOverlay;