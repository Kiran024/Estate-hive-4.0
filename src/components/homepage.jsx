import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from './home/HeroSection';
import VerifiedExclusives from './home/VerifiedExclusives';
import RealEstateEcosystem from './home/RealEstateEcosystem';
import Testimonials from './Testimonials';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to a specific section after navigation
    const scrollToId = location.state?.scrollToId;
    if (scrollToId) {
      // Wait a bit for components to render
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <>
      <HeroSection />
      <VerifiedExclusives />
      <RealEstateEcosystem />
      <Testimonials />
    </>
  );
};

export default HomePage;

