import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../util/supabaseClient';
import AuthToggleButton from './AuthToggleButton';
import { FiChevronRight, FiUser, FiLogOut, FiSettings, FiHome, FiHeart } from 'react-icons/fi';
import useHideOnScroll from '../../hooks/useHideOnScroll';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user: currentUser, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState({ propertiesSaved: 0 });

  const { hidden, isScrolled, scrollProgress } = useHideOnScroll({ 
    threshold: 50,
    topOffset: 10,
    tolerance: 3
  });
  const effectivelyHidden = hidden && !isOpen;

  const navRef = useRef(null);
  const [navH, setNavH] = useState(72);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // measure nav height
  useLayoutEffect(() => {
    const read = () => setNavH(navRef.current?.offsetHeight ?? 72);
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  // expose height to CSS var
  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--nav-height', `${navH}px`);
  }, [navH]);

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const profile = await userService.getUserProfile(currentUser.id);
          setUserProfile(profile);
          
          // Fetch user stats for saved properties count
          const userStats = await userService.getUserStats(currentUser.id);
          setStats({ propertiesSaved: userStats.propertiesSaved || 0 });
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Set basic profile if fetch fails
          setUserProfile({
            full_name: currentUser.user_metadata?.full_name || '',
            email: currentUser.email,
            avatar_url: currentUser.user_metadata?.avatar_url || ''
          });
          setStats({ propertiesSaved: 0 });
        }
      } else {
        setUserProfile(null);
        setStats({ propertiesSaved: 0 });
      }
    };
    
    fetchProfile();
  }, [currentUser]);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const handleNavigation = (path) => {
    if (path.startsWith('/#')) {
      const id = path.split('#')[1];
      
      // Check if we're on the homepage
      if (location.pathname === '/') {
        // We're on homepage, scroll directly to the element
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // We're on a different page, navigate to homepage with hash state
        navigate('/', { state: { scrollToId: id } });
      }
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await signOut();
      // signOut already navigates to '/' in AuthContext
    } catch (e) {
      console.error('Logout error:', e?.message || e);
    }
  };

  const headerVariants = {
    show: { 
      y: 0, 
      transition: { 
        type: 'tween',
        duration: 0.2,
        ease: 'easeOut'
      } 
    },
    hide: { 
      y: '-100%', 
      transition: { 
        type: 'tween',
        duration: 0.2,
        ease: 'easeIn'
      } 
    },
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'AI Agents', path: '/ai-agent-ecosystem' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blogs', path: '/blog' },
    { name: 'Contact', path: '/contact-us' },
  ];

  const userName = userProfile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0];
  const userAvatar = userProfile?.avatar_url || currentUser?.user_metadata?.avatar_url || null;

  return (
    <motion.nav
      id="site-nav"
      ref={navRef}
      variants={headerVariants}
      initial="show"
      animate={effectivelyHidden ? 'hide' : 'show'}
      className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md"
      style={{
        pointerEvents: effectivelyHidden ? 'none' : 'auto',
        boxShadow: isScrolled ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        willChange: 'transform',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => handleNavigation('/')}>
          <img src="/EH_Logo.svg" alt="Estate Hive Logo" className="h-12 md:h-16 object-contain" />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className="cursor-pointer hover:opacity-70 transition-colors duration-300 text-gray-900"
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Profile / Auth */}
        <div className="hidden md:flex ml-8 relative" ref={dropdownRef}>
          {!currentUser ? (
            <AuthToggleButton
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleNavigation={handleNavigation}
            />
          ) : (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen((p) => !p)}
                className="relative h-11 w-11 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
                    {userName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-[60]"
                  >
                    {/* Profile Header */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {userAvatar ? (
                            <img 
                              src={userAvatar} 
                              alt={userName} 
                              className="w-16 h-16 rounded-full border-3 border-white shadow-md object-cover" 
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl border-3 border-white/50">
                              {userName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg">{userName}</h3>
                          <p className="text-white/80 text-sm">{currentUser?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setDropdownOpen(false);
                        }}
                        className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-50 p-3 rounded-xl transition-colors group"
                      >
                        <span className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">My Profile</p>
                            <p className="text-xs text-gray-500">Manage your account</p>
                          </div>
                        </span>
                        <FiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => {
                          navigate('/properties');
                          setDropdownOpen(false);
                        }}
                        className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-50 p-3 rounded-xl transition-colors group"
                      >
                        <span className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <FiHome className="text-purple-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">Browse Properties</p>
                            <p className="text-xs text-gray-500">Explore listings</p>
                          </div>
                        </span>
                        <FiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => {
                          navigate('/saved');
                          setDropdownOpen(false);
                        }}
                        className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-50 p-3 rounded-xl transition-colors group"
                      >
                        <span className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                            <FiHeart className="text-pink-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">Saved Properties</p>
                            <p className="text-xs text-gray-500">Your favorites</p>
                          </div>
                        </span>
                        <FiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => {
                          navigate('/settings');
                          setDropdownOpen(false);
                        }}
                        className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-50 p-3 rounded-xl transition-colors group"
                      >
                        <span className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            <FiSettings className="text-gray-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">Settings</p>
                            <p className="text-xs text-gray-500">Preferences</p>
                          </div>
                        </span>
                        <FiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div className="border-t mt-2 pt-2">
                        <button
                          onClick={() => {
                            handleLogout();
                            setDropdownOpen(false);
                          }}
                          className="flex items-center justify-between w-full text-red-600 hover:bg-red-50 p-3 rounded-xl transition-colors group"
                        >
                          <span className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <FiLogOut className="text-red-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-sm">Sign Out</p>
                              <p className="text-xs text-gray-500">See you later</p>
                            </div>
                          </span>
                          <FiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Header Actions */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Profile Avatar */}
          {currentUser && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md"
            >
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                  {userName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
            </motion.button>
          )}
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="text-2xl text-gray-900 p-1"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 w-full sm:w-80 h-screen bg-white shadow-2xl z-[60] overflow-y-auto"
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="text-xl text-gray-700" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-6 pt-16">
              {currentUser ? (
                <>
                  {/* User Profile Section */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        {userAvatar ? (
                          <img 
                            src={userAvatar} 
                            alt={userName} 
                            className="w-16 h-16 rounded-full border-3 border-white shadow-md object-cover" 
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                            {userName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{userName || 'User'}</h3>
                        <p className="text-gray-600 text-sm truncate">{currentUser?.email}</p>
                        {stats.propertiesSaved > 0 && (
                          <p className="text-indigo-600 text-sm font-medium mt-1">
                            {stats.propertiesSaved} saved properties
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h4>
                    <div className="space-y-1">
                      {menuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                        >
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Profile Options */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                      >
                        <FiUser className="text-lg" />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/properties');
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center gap-3"
                      >
                        <FiHome className="text-lg" />
                        <span>Browse Properties</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/saved');
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-3 relative"
                      >
                        <FiHeart className="text-lg" />
                        <span>Saved Properties</span>
                        {stats.propertiesSaved > 0 && (
                          <span className="absolute right-4 px-2 py-0.5 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full">
                            {stats.propertiesSaved}
                          </span>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-3"
                      >
                        <FiSettings className="text-lg" />
                        <span>Settings</span>
                      </button>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Navigation for non-logged users */}
                  <div className="mb-8">
                    <div className="space-y-1">
                      {menuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auth Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate('/auth', { state: { mode: 'signin' } });
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate('/auth', { state: { mode: 'signup' } });
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      Create Account
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[59] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;