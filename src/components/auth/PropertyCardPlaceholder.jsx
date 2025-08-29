import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCardPlaceholder = ({ index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative group"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Blurred Image Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Lock Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="bg-white/90 backdrop-blur-md rounded-full p-3"
            >
              <Lock className="w-6 h-6 text-gray-800" />
            </motion.div>
          </div>

          {/* Premium Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            PREMIUM
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title Placeholder */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded-md animate-pulse w-3/4"></div>
          </div>

          {/* Details Placeholder */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 bg-gray-100 rounded-md animate-pulse w-20"></div>
              <div className="h-3 bg-gray-100 rounded-md animate-pulse w-16"></div>
            </div>
            <div className="h-3 bg-gray-100 rounded-md animate-pulse w-1/2"></div>
          </div>

          {/* CTA Section */}
          <Link to="/auth" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Sign In to View
            </motion.button>
          </Link>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-3">
            Create a free account to unlock this property
          </p>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default PropertyCardPlaceholder;