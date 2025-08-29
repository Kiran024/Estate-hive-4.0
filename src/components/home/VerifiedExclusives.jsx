import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import PropertyListing from '../PropertyListing';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { supabase } from '../../util/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const features = [
  {
    title: 'Owner-Signed Exclusivity',
    desc: 'Direct partnerships with property owners',
    icon: '/cup.svg',
    hoverIcon: '/cup read.svg',
  },
  {
    title: 'Professional Media',
    desc: 'Free photography and virtual tours',
    icon: '/camera.svg',
    hoverIcon: '/cam red.svg',
  },
  {
    title: 'Pre-Verified Documents',
    desc: 'Complete legal verification process',
    icon: '/verified.svg',
    hoverIcon: '/verified red.svg',
  },
  {
    title: 'GeoHeat Tracking',
    desc: 'AI-powered market intelligence',
    icon: '/geo heat_1.svg',
    hoverIcon: '/geo red.svg',
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const VerifiedExclusives = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');
  const { user } = useAuth();

  useEffect(() => {
    fetchVerifiedProperties();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('verified-properties')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'properties', filter: 'is_verified=eq.true' },
        () => {
          fetchVerifiedProperties();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchVerifiedProperties = async () => {
    try {
      // Fetch verified/featured properties
      const { data } = await propertyService.getAllProperties({
        status: 'active',
        is_featured: true,
        sortBy: 'created_at',
        sortOrder: 'desc',
        pageSize: 48 // Show up to 48 properties on homepage
      });

      // If no featured properties, get recent active properties
      let properties = data || [];
      if (properties.length === 0) {
        const recentResult = await propertyService.getRecentProperties(48);
        properties = recentResult.data || [];
      }

      // Transform properties to match PropertyListing format
      const transformedListings = properties.map((property) => ({
        id: property.id,
        title: property.title || property.name || 'Untitled Property',
        location: [property.neighborhood, property.city].filter(Boolean).join(', ') || property.location || 'Location TBD',
        price: property.price || property.rent_amount ? 
          formatPropertyPrice(property.price || property.rent_amount) : 
          'Price on Request',
        category: mapCategory(property.category),
        bhk: property.property_subtype || property.bedrooms ? `${property.bedrooms || ''} BHK` : property.property_type,
        area: property.area_sqft ? `${property.area_sqft} sqft` : '',
        badge: mapCategory(property.category),
        image: property.image_urls?.[0] || property.featured_image || '/h01@300x-100.jpg',
        propertyType: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        isVerified: property.is_verified,
        isFeatured: property.is_featured
      }));

      setListings(transformedListings);
    } catch (error) {
      console.error('Error fetching verified properties:', error);
      // Use fallback data if fetch fails
      setListings(getFallbackListings());
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (index, e) => {
    // For non-authenticated users, show login modal after 6 properties
    if (!user && index >= 6) {
      e.preventDefault();
      setShowAuthModal(true);
      setAuthModalMode('signin');
    }
  };

  // Helper function to format price
  const formatPropertyPrice = (price) => {
    if (!price) return 'Price on Request';
    
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(2)} L`;
    } else if (price < 100000 && price > 10000) {
      return `${(price / 1000).toFixed(0)}K/month`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Map database category to display category
  const mapCategory = (category) => {
    const categoryMap = {
      'sale': 'For Sale',
      'rent': 'For Rent',
      'lease': 'Luxury Rentals',
      'rent_to_own': 'EH Signature™'
    };
    return categoryMap[category] || 'For Sale';
  };

  // Fallback listings if database is empty
  const getFallbackListings = () => {
    const fallbackData = [
      { name: "Konig Villas North County", type: "4 BHK", location: "Devanahalli", price: "2.46 - 3.21 Cr", category: "For Sale" },
      { name: "Barca At Godrej MSR City", type: "2/3 BHK", location: "Devanahalli", price: "1.3 - 1.89 Cr", category: "For Sale" },
      { name: "Brigade Atmosphere", type: "3/4 BHK", location: "Devanahalli", price: "1.02 - 4 Cr", category: "For Rent" },
      { name: "Total Environment", type: "Land", location: "Devanahalli", price: "1.56 - 6.25 Cr", category: "For Rent" },
      { name: "Sobha Hamptons", type: "3/4 BHK", location: "Attibele", price: "1.57 - 2.45 Cr", category: "Luxury Rentals" },
      { name: "Total Down by the water", type: "3/4 BHK", location: "Yelahanka", price: "4.49 - 11.75 Cr", category: "EH Signature™" }
    ];

    return fallbackData.map((item, index) => ({
      id: index + 1,
      title: item.name,
      location: item.location,
      price: item.price,
      category: item.category,
      bhk: item.type,
      area: '',
      badge: item.category,
      image: '/h01@300x-100.jpg'
    }));
  };

  return (
    <>
      <section className="bg-[#05051f] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Motion.p
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#b32b14] font-bold text-2xl sm:text-3xl md:text-[40px] mb-2"
          >
            <span style={{ fontFamily: "'Exo 2', sans-serif" }}>EH Verified</span>
            <span
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: '20px',
                verticalAlign: 'super',
                marginLeft: '2px',
              }}
            >
              ™
            </span>
            &nbsp;Exclusives
          </Motion.p>

          <Motion.h2
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...fadeInVariants.visible.transition, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[70px] font-bold mb-4 leading-tight"
          >
            Only on Estate Hive.<br className="hidden md:block" />
            Nowhere else.
          </Motion.h2>

          <Motion.p
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...fadeInVariants.visible.transition, delay: 0.4 }}
            className="text-gray-300 text-sm sm:text-base md:text-lg mb-12 max-w-2xl mx-auto"
          >
            Owner-signed exclusivity. Free professional media. Pre-verified legal docs. GeoHeat™ enabled.
          </Motion.p>

          <Motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {features.map((item, i) => (
              <Motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-white text-[#121212] rounded-3xl p-8 md:p-8 flex flex-col items-center text-center shadow-none hover:shadow-[8px_8px_20px_#b32b14] group"
              >
                <div className="relative h-16 w-16 mb-6">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="h-16 w-16 absolute top-0 left-0 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                  />
                  <img
                    src={item.hoverIcon}
                    alt={`${item.title} Hover`}
                    className="h-16 w-16 absolute top-0 left-0 opacity-0 group-hover:opacity-300 transition-opacity duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-[#121212] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* Show loading state or properties */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : (
        <>
          <PropertyListing 
          listings={user ? listings : listings.slice(0, 6)} 
          onPropertyClick={handlePropertyClick}
          showLoginPrompt={!user && listings.length > 6}
        />
        
        {/* Show "View More" login prompt for non-authenticated users */}
        {!user && listings.length > 6 && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Unlock {listings.length - 6} More Premium Properties
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create a free account to access our complete collection of verified exclusive properties
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setAuthModalMode('signin');
                    setShowAuthModal(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-lg hover:border-gray-300 transition-all duration-300"
                >
                  Create Account
                </button>
              </div>
            </div>
          </Motion.div>
        )}
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authModalMode}
        />
          
          {/* Show total count */}
          {listings.length > 0 && (
            <div className="text-center mt-4 mb-8">
              <p className="text-gray-600">
                Showing {listings.length} verified exclusive properties
              </p>
            </div>
          )}
        </>
      )}

      <Motion.div
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ ...fadeInVariants.visible.transition, delay: 0.5 }}
        className="text-center mt-20 z-30"
      >
        <Link
          to="/properties"
          className="inline-block bg-[#040449] text-white font-semibold text-md px-6 mb-15 py-3 rounded-[12px] shadow-lg hover:bg-red-700 transition duration-300"
        >
          Browse All <span style={{ fontFamily: "'Exo 2', sans-serif" }}>EH Verified<span style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '0.75em', verticalAlign: 'super', marginLeft: '2px' }}>™</span></span> Listings
        </Link>
      </Motion.div>
    </>
  );
};

export default VerifiedExclusives;