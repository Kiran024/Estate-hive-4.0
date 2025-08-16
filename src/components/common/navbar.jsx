import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import AuthToggleButton from './AuthToggleButton';
import { FiSettings, FiBell, FiLogOut, FiChevronRight, FiUser } from 'react-icons/fi';
import { BsSun, BsMoon } from 'react-icons/bs';
import { MdLanguage } from 'react-icons/md';







const supabaseUrl = 'https://qfmglenbyvhfrydozzqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbWdsZW5ieXZoZnJ5ZG96enFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTksImV4cCI6MjA2ODM1MzUxOX0.KgiS9wmPVCnGCxYxLE2wSKRgwYwXvLU-j8UtIpmDUfQ'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const storedImage = localStorage.getItem('userProfileImage');
const userName = currentUser?.user_metadata?.name;
const userAvatar = storedImage || currentUser?.user_metadata?.avatar_url || '/default-avatar.png';

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'AI Agents', path: '/ai-agent-ecosystem' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blogs', path: '/blog' },
    { name: 'Contact', path: '/contact-us' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 150);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
  const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setCurrentUser(session?.user || null);
  };

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setCurrentUser(session?.user || null);
    
  });

  getUser();

  return () => {
    authListener?.subscription?.unsubscribe?.();
  };
}, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    if (path.startsWith('/#')) {
      window.location.href = path;
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: '-100%' },
    visible: { opacity: 1, y: '0%' },
    exit: { opacity: 0, y: '-100%' },
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };


  
  const staggerContainerVariants = {
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  };

  return (
    <motion.nav
      initial={false}
      animate={{
        y: isOpen ? '0%' : isScrollingDown ? '-100%' : '0%',
        backgroundColor: isScrolled || isOpen ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        boxShadow: isScrolled || isOpen ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
        backdropFilter: isScrolled || isOpen ? 'blur(8px)' : 'none',
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full z-[9999]"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => handleNavigation('/')}> 
          <img src="/EH_Logo.svg" alt="Estate Hive Logo" className="h-12 md:h-16 object-contain" />
        </div>

        <ul className={`hidden md:flex space-x-8 text-lg ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
          {menuItems.map((item) => (
            <li key={item.name} onClick={() => handleNavigation(item.path)} className="text-black">
              {item.name}
            </li>
          ))}
        </ul>

        {/* Profile or Auth Toggle */}
        <div className="hidden md:flex ml-8 relative" ref={dropdownRef}>
          {!currentUser ? (
            <AuthToggleButton
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleNavigation={handleNavigation}
            />
          ) : (
            <div className="relative">
              {currentUser?.user_metadata?.avatar_url ? (
  <img
    src={currentUser.user_metadata.avatar_url}
    alt="Profile"
    className="h-10 w-10 rounded-full cursor-pointer border-2 border-indigo-600 hover:scale-105 transition"
    onClick={() => setDropdownOpen((prev) => !prev)}
  />
) : (
  <div
    onClick={() => setDropdownOpen((prev) => !prev)}
    className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer font-bold border-2 border-indigo-500 hover:scale-105 transition"
  >
    {currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
  </div>
)}
              {dropdownOpen && (
  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-600 rounded-xl shadow-lg p-4 space-y-3 z-50 transition-all">
  {/* User Info */}
  <div className="flex items-center gap-3 border-b pb-3">
    <img
      src={userAvatar}
      alt="User"
      className="w-10 h-10 rounded-full object-cover border"
    />
    <div>
      <p className="text-sm font-semibold text-gray-800 dark:text-white">{userName}</p>
      <p className="text-xs text-gray-300">{currentUser?.email}</p>
    </div>
  </div>

  {/* My Profile */}
  <button
    onClick={() => navigate('/profile')}
    className="flex items-center justify-between w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md"
  >
    <div className="flex items-center gap-2">
      <FiUser />
      My Profile
    </div>
    <FiChevronRight />
  </button>
  

 

  {/* Log Out */}
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 w-full text-sm text-red-500 hover:bg-red-50 p-2 rounded-md"
  >
    <FiLogOut /> Sign Out
  </button>
</div>

)}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`text-2xl ${isOpen ? 'text-indigo-900' : isScrolled ? 'text-gray-800' : 'text-white'}`}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 w-full h-screen bg-white text-gray-800 z-[9998] pt-28 px-6"
          >
            <motion.ul
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col space-y-6"
            >
              {menuItems.map((item) => (
                <motion.li
                  key={item.name}
                  variants={mobileLinkVariants}
                  onClick={() => handleNavigation(item.path)}
                  className="cursor-pointer text-lg hover:text-red-600"
                >
                  {item.name}
                </motion.li>
              ))}
              <motion.li variants={mobileLinkVariants}>
                {!currentUser ? (
                  <div className="relative w-full h-[48px] mt-8 font-semibold rounded-full overflow-hidden shadow text-base">
                    <div
                      className={`absolute top-0 bottom-0 w-1/2 transition-all duration-300 ease-in-out rounded-full bg-indigo-700 z-0 ${activeTab === 'signup' ? 'left-1/2' : 'left-0'}`}
                    />
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        handleNavigation('/auth');
                      }}
                      className={`w-1/2 py-2 z-10 relative transition-all ${activeTab === 'login' ? 'text-white' : 'text-indigo-700'}`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('signup');
                        handleNavigation('/auth');
                      }}
                      className={`w-1/2 py-2 z-10 relative transition-all ${activeTab === 'signup' ? 'text-white' : 'text-indigo-700'}`}
                    >
                      Signup
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600"
                  >
                    Sign Out
                  </button>
                )}
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );

};
export default Navbar;
