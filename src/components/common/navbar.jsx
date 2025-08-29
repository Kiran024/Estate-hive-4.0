import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import AuthToggleButton from './AuthToggleButton';
import { FiChevronRight, FiUser, FiLogOut } from 'react-icons/fi';
import useHideOnScroll from '../../hooks/useHideOnScroll';

const supabase = createClient(
  'https://qfmglenbyvhfrydozzqp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbWdsZW5ieXZoZnJ5ZG96enFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTksImV4cCI6MjA2ODM1MzUxOX0.KgiS9wmPVCnGCxYxLE2wSKRgwYwXvLU-j8UtIpmDUfQ'
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { hidden, isScrolled } = useHideOnScroll({ topOffset: 20, tolerance: 12 });
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

  // Supabase session
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    const { data: authListener } = supabase.auth.onAuthStateChange((_e, session) => {
      setCurrentUser(session?.user || null);
    });
    init();
    return () => authListener?.subscription?.unsubscribe?.();
  }, []);

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
      const el = document.getElementById(id);
      el ? el.scrollIntoView({ behavior: 'smooth', block: 'start' }) : (window.location.href = path);
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (e) {
      console.error('Logout error:', e?.message || e);
    }
  };

  const headerVariants = {
    show: { y: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    hide: { y: '-100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'AI Agents', path: '/ai-agent-ecosystem' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blogs', path: '/blog' },
    { name: 'Contact', path: '/contact-us' },
  ];

  const userName = currentUser?.user_metadata?.name;
  const storedImage = (typeof window !== 'undefined' && localStorage.getItem('userProfileImage')) || null;
  const userAvatar = storedImage || currentUser?.user_metadata?.avatar_url || '/default-avatar.png';

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
        boxShadow: (isScrolled || isOpen) ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
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
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-indigo-500 hover:scale-105 transition"
              >
                {currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg p-4 space-y-3 z-[60]">
                  <div className="flex items-center gap-3 border-b pb-3">
                    <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full object-cover border" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-500">{currentUser?.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center justify-between w-full text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <FiUser />
                      My Profile
                    </div>
                    <FiChevronRight />
                  </button>

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

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="text-2xl text-gray-900"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 w-full h-screen bg-white text-gray-800 z-[60] px-6"
            style={{ paddingTop: navH }}
          >
            <ul className="flex flex-col space-y-6">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="cursor-pointer text-lg hover:text-red-600"
                >
                  {item.name}
                </li>
              ))}

              <li>
                {!currentUser ? (
                  <div className="relative w-full h-12 mt-8 font-semibold rounded-full overflow-hidden shadow">
                    <div
                      className={`absolute inset-y-0 w-1/2 transition-all duration-300 rounded-full bg-indigo-700 ${
                        activeTab === 'signup' ? 'left-1/2' : 'left-0'
                      }`}
                    />
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        handleNavigation('/auth');
                      }}
                      className={`w-1/2 h-full relative z-10 ${
                        activeTab === 'login' ? 'text-white' : 'text-indigo-700'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('signup');
                        handleNavigation('/auth');
                      }}
                      className={`w-1/2 h-full relative z-10 ${
                        activeTab === 'signup' ? 'text-white' : 'text-indigo-700'
                      }`}
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
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;