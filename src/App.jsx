import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './AuthPage.css';

import Navbar from './components/common/navbar';
import Footer from './components/common/footer';

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
const AllProperties = lazy(() => import('./pages/AllProperties'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));






// ✅ Scroll to Top on Route Change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
                </Routes>
                </Suspense>
            </main>

            {!hideNavFooter && <Footer />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Layout />
        </Router>
    );
}

export default App;
