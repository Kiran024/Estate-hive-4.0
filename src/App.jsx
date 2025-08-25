import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { scrollToTop } from './hooks/useScrollToTop';
import './App.css';
import './AuthPage.css';

import Navbar from './components/common/navbar';
import Footer from './components/common/footer';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const HomePage = lazy(() => import('./components/homepage'));
const AIAgentEcosystem = lazy(() => import('./components/technologies/AIAgentEcosystem'));
const Blog = lazy(() => import('./components/Blog'));
const EHAccelerate = lazy(() => import('./components/services/EHAccelerate'));
const EHDesign = lazy(() => import('./components/services/EHDesign'));
const EHLiving = lazy(() => import('./components/services/EHLiving'));
const EHRank = lazy(() => import('./components/services/EHRank'));
const EHSignature = lazy(() => import('./components/services/EHSignature'));
const EHStay = lazy(() => import('./components/services/EHStay'));
const EHCommercial = lazy(() => import('./components/services/EHCommercial'));
const EHGeoHeat = lazy(() => import('./components/technologies/EHGeoHeat'));
const SmartMatchEngine = lazy(() => import('./components/technologies/SmartMatchEngine'));
const Career = lazy(() => import('./components/careers'));
const Autherization = lazy(() => import('./components/AuthPage'));
const ContactUs = lazy(() => import('./components/ContactUs'));
const Confirmed = lazy(() => import('./pages/Confirmed'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const AllProperties = lazy(() => import('./pages/AllPropertiesEnhanced'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetailsEnhanced'));
const TestProperties = lazy(() => import('./components/TestProperties'));






// ✅ Enhanced Scroll to Top on Route Change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        // Use the centralized scroll utility for consistency
        scrollToTop({ behavior: 'instant' });
        
        // Additional scroll after a short delay to handle async content
        const timeoutId = setTimeout(() => {
            scrollToTop({ behavior: 'instant' });
        }, 100);
        
        // Reset scrollable containers
        const resetScrollContainers = () => {
            try {
                const scrollableElements = document.querySelectorAll([
                    '.overflow-auto',
                    '.overflow-y-auto', 
                    '.overflow-x-auto',
                    '.overflow-scroll',
                    '[data-scroll]',
                    '.scroll-container'
                ].join(', '));
                
                scrollableElements.forEach(el => {
                    if (el.scrollTop !== undefined) el.scrollTop = 0;
                    if (el.scrollLeft !== undefined) el.scrollLeft = 0;
                });
            } catch (error) {
                console.warn('Error resetting scroll containers:', error);
            }
        };
        
        resetScrollContainers();
        setTimeout(resetScrollContainers, 50);
        
        return () => {
            clearTimeout(timeoutId);
        };
        
    }, [pathname]);
    
    return null;
};

// ✅ Main App Layout
const Layout = () => {
    const { pathname } = useLocation();
    const hideNavFooter = pathname === '/auth';

    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavFooter && <Navbar />}

            <main className="flex-grow">
                <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    <Route path="/confirmed" element={<Confirmed />} />
                    <Route path="/auth-reset" element={<ResetPassword />} />
                    <Route path="/profile" element={<UserProfile />} />

                    <Route path="/ai-agent-ecosystem" element={<AIAgentEcosystem />} />
                    <Route path="/blog" element={<Blog />} />
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
    // Disable browser's automatic scroll restoration
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
