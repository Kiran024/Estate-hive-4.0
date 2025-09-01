import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Lock, Eye, Home, Shield, Sparkles, X } from 'lucide-react';

const LoginPromptOverlay = ({ 
  children, 
  showOverlay = true, 
  title = "Unlock Premium Properties",
  subtitle = "Sign in to browse our exclusive collection of verified properties"
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

      {/* Fixed Overlay to prevent footer overlap */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900/40 via-gray-800/50 to-gray-900/40 backdrop-blur-sm"
        >
          {/* Centering Container - Fixed for all screens */}
          <div className="min-h-screen flex items-center justify-center p-4">
            {/* Main Content Card - Compact Version */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-sm"
            >
              {/* Glass Card with reduced padding */}
              <div 
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ backgroundColor: '#FFFFFF' }}
              >
                {/* Lock Icon with Animation - Smaller */}
                <motion.div 
                  className="flex justify-center mb-4"
                  animate={{ 
                    rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                    scale: isHovered ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-lg opacity-30" style={{ backgroundColor: '#1B1B59' }}></div>
                    <div className="relative rounded-full p-3" style={{ backgroundColor: '#1B1B59' }}>
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Title and Subtitle - Compact */}
                <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#1B1B59' }}>
                  {title}
                </h2>
                <p className="text-gray-600 text-center text-sm mb-5 leading-relaxed">
                  {subtitle}
                </p>

                {/* Features List - Compact */}
                <div className="space-y-2 mb-5">
                  <motion.div 
                    className="flex items-center gap-2 text-gray-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1B1B59' }}>
                      <Eye className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs">View complete property details & photos</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-gray-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1B1B59' }}>
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs">Access verified & exclusive properties</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-gray-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1B1B59' }}>
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs">Connect directly with property owners</span>
                  </motion.div>
                </div>

                {/* CTA Buttons - Compact */}
                <div className="space-y-2">
                  <Link 
                    to="/auth" 
                    state={{ from: location.pathname }}
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      style={{ backgroundColor: '#1B1B59' }}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Sign In to Continue
                    </motion.button>
                  </Link>

                  <div className="flex items-center gap-2 my-2">
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
                      className="w-full bg-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm"
                      style={{ 
                        border: '2px solid #1B1B59',
                        color: '#1B1B59'
                      }}
                    >
                      Create Free Account
                    </motion.button>
                  </Link>
                </div>

                {/* Home Link - Compact */}
                <div className="mt-4 text-center">
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-1 text-xs transition-colors hover:opacity-80"
                    style={{ color: '#1B1B59' }}
                  >
                    <Home className="w-3 h-3" />
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Premium Badge - Smaller */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 left-1/2 transform -translate-x-1/2"
              >
                <div className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg" style={{ backgroundColor: '#1B1B59' }}>
                  PREMIUM ACCESS
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoginPromptOverlay;