import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { scrollToTop } from './hooks/useScrollToTop';
import './App.css';
import './AuthPage.css';

import Navbar from './components/common/navbar';
import Footer from './components/common/footer';

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

// Lazy routes
const ResetPassword     = lazy(() => import('./pages/ResetPassword'));
const HomePage          = lazy(() => import('./components/homepage'));
const AIAgentEcosystem  = lazy(() => import('./components/technologies/AIAgentEcosystem'));
const Blog              = lazy(() => import('./components/Blog'));
const BlogDetails       = lazy(() => import('./components/BlogDetails'));
const EHAccelerate      = lazy(() => import('./components/services/EHAccelerate'));
const EHDesign          = lazy(() => import('./components/services/EHDesign'));
const EHLiving          = lazy(() => import('./components/services/EHLiving'));
const EHRank            = lazy(() => import('./components/services/EHRank'));
const EHSignature       = lazy(() => import('./components/services/EHSignature'));
const EHStay            = lazy(() => import('./components/services/EHStay'));
const EHCommercial      = lazy(() => import('./components/services/EHCommercial'));
const EHGeoHeat         = lazy(() => import('./components/technologies/EHGeoHeat'));
const SmartMatchEngine  = lazy(() => import('./components/technologies/SmartMatchEngine'));
const Career            = lazy(() => import('./components/careers'));
const Autherization     = lazy(() => import('./components/AuthPage'));
const AuthCallback      = lazy(() => import('./pages/AuthCallback'));
const SavedProperties   = lazy(() => import('./pages/SavedProperties'));
const Settings          = lazy(() => import('./pages/Settings'));
const ContactUs         = lazy(() => import('./components/ContactUs'));
const Confirmed         = lazy(() => import('./pages/Confirmed'));
const UserProfile       = lazy(() => import('./components/UserProfile'));
const AllProperties     = lazy(() => import('./pages/AllPropertiesEnhanced'));
const PropertyDetails   = lazy(() => import('./pages/PropertyDetailsEnhanced'));
const TestProperties    = lazy(() => import('./components/TestProperties'));

/* ---------------------------
   ScrollToTop on route change
---------------------------- */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // manual scroll restoration
    scrollToTop({ behavior: 'instant' });

    // handle async content mount
    const t1 = setTimeout(() => scrollToTop({ behavior: 'instant' }), 100);

    // if there is a hash (#section), try to bring it into view post-mount
    const t2 = setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 160);

    // reset any custom scroll containers
    const resetScrollContainers = () => {
      try {
        const nodes = document.querySelectorAll([
          '.overflow-auto',
          '.overflow-y-auto',
          '.overflow-x-auto',
          '.overflow-scroll',
          '[data-scroll]',
          '.scroll-container',
        ].join(', '));
        nodes.forEach(el => {
          if (el.scrollTop !== undefined) el.scrollTop = 0;
          if (el.scrollLeft !== undefined) el.scrollLeft = 0;
        });
      } catch {}
    };
    resetScrollContainers();
    const t3 = setTimeout(resetScrollContainers, 50);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, hash]);

  return null;
};

/* ---------------------------
   Main App Layout
---------------------------- */
const Layout = () => {
  const { pathname } = useLocation();
  const hideNavFooter = pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Keep Navbar mounted across all routes for global scroll-hide */}
      {!hideNavFooter && <Navbar />}

      {/* Add padding-top to avoid content sitting under fixed navbar - except for auth page */}
      <main className={`flex-grow ${hideNavFooter ? '' : 'pt-16 md:pt-20'}`}>
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/confirmed" element={<Confirmed />} />
            <Route path="/auth-reset" element={<ResetPassword />} />
            <Route path="/profile" element={<UserProfile />} />

            <Route path="/ai-agent-ecosystem" element={<AIAgentEcosystem />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route path="/eh-accelerate" element={<EHAccelerate />} />
            <Route path="/eh-design" element={<EHDesign />} />
            <Route path="/eh-living" element={<EHLiving />} />
            <Route path="/eh-rank" element={<EHRank />} />
            <Route path="/eh-signature" element={<EHSignature />} />
            <Route path="/eh-stay" element={<EHStay />} />
            <Route path="/eh-commercial" element={<EHCommercial />} />
            <Route path="/eh-geoheat" element={<EHGeoHeat />} />
            <Route path="/smart-match-engine" element={<SmartMatchEngine />} />
            <Route path="/careers" element={<Career />} />
            <Route path="/auth" element={<Autherization />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/saved" element={<SavedProperties />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/properties" element={<AllProperties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/test-db" element={<TestProperties />} />
          </Routes>
        </Suspense>
      </main>

      {!hideNavFooter && <Footer />}
    </div>
  );
};

function App() {
  // fully disable browser auto-restoration so our ScrollToTop + Navbar behavior is reliable
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Layout />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
