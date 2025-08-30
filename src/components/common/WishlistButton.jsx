import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { wishlistService } from '../../services/wishlistService';
import { useNavigate } from 'react-router-dom';

const WishlistButton = ({ 
  propertyId, 
  className = '', 
  size = 'md',
  showText = false,
  variant = 'default' // default, floating, compact
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (user && propertyId) {
      checkSavedStatus();
    } else {
      setInitialLoading(false);
    }
  }, [user, propertyId]);

  const checkSavedStatus = async () => {
    try {
      setInitialLoading(true);
      const saved = await wishlistService.isPropertySaved(user.id, propertyId);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/auth', { state: { from: location.pathname } });
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      const newSavedStatus = await wishlistService.toggleWishlist(user.id, propertyId);
      setIsSaved(newSavedStatus);
      
      // Show a brief success indicator
      const successMessage = newSavedStatus ? 'Added to wishlist!' : 'Removed from wishlist!';
      showToast(successMessage, newSavedStatus ? 'success' : 'info');
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      
      if (error.message === 'Property already saved') {
        setIsSaved(true);
      } else if (error.message?.includes('Database not configured')) {
        showToast('Wishlist feature is being set up. Please try again later.', 'error');
      } else {
        showToast('Failed to update wishlist', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'w-8 h-8',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    md: {
      button: 'w-10 h-10',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      button: 'w-12 h-12',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size];

  // Variant styles
  const variantStyles = {
    default: `${config.button} bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-md`,
    floating: `${config.button} bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl`,
    compact: `${config.button} bg-gray-100 hover:bg-gray-200`
  };

  if (initialLoading) {
    return (
      <div className={`${variantStyles[variant]} rounded-full flex items-center justify-center ${className}`}>
        <Loader2 className={`${config.icon} text-gray-400 animate-spin`} />
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`
        ${variantStyles[variant]} 
        rounded-full flex items-center justify-center 
        transition-all duration-300 group relative
        ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        ${isSaved ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}
        ${className}
      `}
      title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <Loader2 className={`${config.icon} animate-spin`} />
      ) : (
        <Heart 
          className={`${config.icon} transition-all duration-200 ${
            isSaved ? 'fill-current' : 'group-hover:fill-current'
          }`} 
        />
      )}
      
      {/* Text label for buttons that show text */}
      {showText && (
        <span className={`ml-2 font-medium ${config.text} ${
          isSaved ? 'text-red-600' : 'text-gray-700'
        }`}>
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}

      {/* Tooltip for compact variants */}
      {variant === 'compact' && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        </div>
      )}

      {/* Ripple effect for saved state */}
      {isSaved && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-red-400 rounded-full"
        />
      )}
    </motion.button>
  );
};

export default WishlistButton;