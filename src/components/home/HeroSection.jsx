import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Range } from 'react-range';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { propertyService } from '../../services/propertyService';

const BUY_MIN = 0;
const BUY_MAX = 250000000;
const RENT_LEASE_MIN = 0;
const RENT_LEASE_MAX = 1000000;

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isPropertyTypeDropdownOpen, setIsPropertyTypeDropdownOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Buy');
  const [minPrice, setMinPrice] = useState(BUY_MIN);
  const [maxPrice, setMaxPrice] = useState(BUY_MAX);
  const [priceRange, setPriceRange] = useState([BUY_MIN, BUY_MAX]);
  const [scrollY, setScrollY] = useState(0);
  
  // Dynamic data from database
  const [locations, setLocations] = useState(['Bengaluru', 'Bangalore']); // Fallback data
  const [propertyTypes, setPropertyTypes] = useState(['Apartment', 'Villa', 'Penthouse', 'Plot', 'Commercial']); // Fallback data
  
  // Detect Safari/iOS for background-attachment compatibility
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect Safari/iOS browsers
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsSafari(isIOSDevice || isSafariBrowser);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dynamic data from database
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        // Fetch unique cities
        const citiesResponse = await propertyService.getUniqueCities();
        if (citiesResponse.data && citiesResponse.data.length > 0) {
          setLocations(citiesResponse.data);
        }

        // Fetch unique property types
        const typesResponse = await propertyService.getUniquePropertyTypes();
        if (typesResponse.data && typesResponse.data.length > 0) {
          setPropertyTypes(typesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dynamic data:', error);
        // Keep fallback data if fetch fails
      }
    };

    fetchDynamicData();
  }, []);

  useEffect(() => {
    if (activeTab === 'Buy') {
      setMinPrice(BUY_MIN);
      setMaxPrice(BUY_MAX);
      setPriceRange([BUY_MIN, BUY_MAX]);
    } else {
      setMinPrice(RENT_LEASE_MIN);
      setMaxPrice(RENT_LEASE_MAX);
      setPriceRange([0, RENT_LEASE_MAX]);
    }
  }, [activeTab]);

  // Handle search functionality
  const handleSearch = () => {
    if (!user) {
      navigate('/auth', { state: { from: '/properties' } });
      return;
    }

    // Create search parameters
    const searchParams = new URLSearchParams();
    
    if (location) {
      searchParams.set('city', location);
    }
    
    if (propertyType) {
      searchParams.set('property_type', propertyType);
    }
    
    // Set category based on active tab
    const categoryMap = {
      'Buy': 'sale',
      'Rent': 'rent', 
      'Lease': 'lease'
    };
    if (categoryMap[activeTab]) {
      searchParams.set('category', categoryMap[activeTab]);
    }
    
    // Add price range (only if not default values)
    if (priceRange[0] > minPrice) {
      searchParams.set('min_price', priceRange[0].toString());
    }
    if (priceRange[1] < maxPrice) {
      searchParams.set('max_price', priceRange[1].toString());
    }

    // Navigate to properties page with search parameters
    const queryString = searchParams.toString();
    navigate(queryString ? `/properties?${queryString}` : '/properties');
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const parallaxBackgroundPosition = `center ${-70 - scrollY * 0.12}px`;

  return (
    <section
      className="scroll-smooth relative w-full min-h-[120vh] md:h-[150vh] bg-no-repeat bg-cover bg-center text-white overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: "url('/Homepage1.webp')",
        backgroundAttachment: isSafari ? 'scroll' : 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: isSafari ? 'center center' : parallaxBackgroundPosition,
        // Pull hero under the fixed navbar so the transparent navbar overlays the hero
        marginTop: 'calc(var(--nav-height, 72px) * -1)'
      }}
    >
      <div className="absolute inset-0 bg-black/20 z-0" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-28 pb-10 flex flex-col items-center justify-center text-center">
        <Motion.h1
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold leading-tight text-white drop-shadow-md max-w-4xl"
        >
          <div>
            Discover{' '}
            <span style={{ fontFamily: "'Exo 2', sans-serif" }}>
              EH Verified
              <span
                style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontSize: '25px',
                  verticalAlign: 'super',
                  marginLeft: '2px',
                }}
              >
                ™
              </span>
            </span>
          </div>
          <div className="mt-1">Homes & Premium Rentals</div>
        </Motion.h1>

        <Motion.p
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...fadeInVariants.visible.transition, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg md:text-xl font-medium text-gray-200 drop-shadow-sm max-w-2xl px-2"
        >
          <span className="block mb-1">Exclusive. Curated. Personalized.</span>
          Luxury homes, elite rentals & smart real estate technology — all in one place.
        </Motion.p>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-10 -mb-px">
          <div className="w-full bg-white/30 backdrop-blur-md text-white font-semibold rounded-t-[15px] flex justify-between sm:justify-around px-4 py-3 text-sm sm:text-base tracking-wide">
            {['Buy', 'Rent', 'Lease'].map((label) => (
              <span
                key={label}
                onClick={() => setActiveTab(label)}
                className={`cursor-pointer hover:underline whitespace-nowrap transition-all duration-200 ${
                  activeTab === label ? 'underline text-white' : 'text-white/80'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <Motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...fadeInVariants.visible.transition, delay: 0.6 }}
          className="w-full max-w-5xl mx-auto px-4 sm:px-6"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-lg rounded-b-[15px] flex flex-col md:flex-row items-start md:items-center px-4 py-6 space-y-5 md:space-y-0 md:gap-0 text-left">
            <div className="relative w-full md:flex-1 md:border-r md:pr-4">
              <label className="block mb-1 text-xs md:text-sm text-gray-800">Location</label>
              <div
                className="w-full flex items-center justify-between text-sm text-gray-800 font-medium cursor-pointer"
                onClick={() => {
                  setIsLocationDropdownOpen((prev) => !prev);
                  setIsPropertyTypeDropdownOpen(false);
                  setRangeOpen(false);
                }}
              >
                <span>{location || 'Bengaluru/Bangalore'}</span>
                <FiChevronDown size={18} className="text-gray-600" />
              </div>
              <AnimatePresence>
                {isLocationDropdownOpen && (
                  <Motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full bg-white rounded-md shadow-lg mt-2 py-1 z-50"
                  >
                    {locations.map((loc) => (
                      <li
                        key={loc}
                        onClick={() => {
                          setLocation(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                      >
                        {loc}
                      </li>
                    ))}
                  </Motion.ul>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-full md:flex-1 md:px-4 md:border-r">
              <label className="block mb-1 text-xs md:text-sm text-gray-800">Property Type</label>
              <div
                className="w-full flex items-center justify-between text-sm text-gray-800 font-medium cursor-pointer"
                onClick={() => {
                  setIsPropertyTypeDropdownOpen((prev) => !prev);
                  setIsLocationDropdownOpen(false);
                  setRangeOpen(false);
                }}
              >
                <span>{propertyType || 'Choose Property Type'}</span>
                <FiChevronDown size={18} className="text-gray-600" />
              </div>
              <AnimatePresence>
                {isPropertyTypeDropdownOpen && (
                  <Motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full bg-white rounded-md shadow-lg mt-2 py-1 z-50"
                  >
                    {propertyTypes.map((type) => (
                      <li
                        key={type}
                        onClick={() => {
                          setPropertyType(type);
                          setIsPropertyTypeDropdownOpen(false);
                        }}
                        className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                      >
                        {type}
                      </li>
                    ))}
                  </Motion.ul>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-full md:flex-1 md:px-4">
              <label className="block mb-1 text-xs md:text-sm text-gray-800">Price Range</label>
              <div
                className="w-full flex items-center justify-between text-sm text-gray-800 font-medium cursor-pointer"
                onClick={() => {
                  setRangeOpen((prev) => !prev);
                  setIsLocationDropdownOpen(false);
                  setIsPropertyTypeDropdownOpen(false);
                }}
              >
                <span>
                  ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
                </span>
                <FiChevronDown size={18} className="text-gray-600" />
              </div>
              <AnimatePresence>
                {rangeOpen && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white p-4 rounded-xl shadow-lg mt-2 z-40"
                  >
                    <Range
                      step={100000}
                      min={minPrice}
                      max={maxPrice}
                      values={priceRange}
                      onChange={setPriceRange}
                      renderTrack={({ props, children }) => (
                        <div {...props} className="h-1 bg-gray-300 rounded" style={props.style}>
                          {children}
                        </div>
                      )}
                      renderThumb={({ props }) => (
                        <div {...props} className="h-4 w-4 bg-[#1F275E] rounded-full shadow-md" />
                      )}
                    />
                    <p className="mt-2 text-center text-sm text-gray-700">
                      ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
                    </p>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

           <div className="w-full md:w-auto md:px-4">
  <button
    onClick={handleSearch}
    className="bg-[#040449] text-white font-semibold text-sm py-3 px-6 rounded-full shadow hover:opacity-90 transition w-full block text-center"
  >
    Search Properties
  </button>
</div>
          </div>
        </Motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-48 md:h-60 bg-gradient-to-t from-[#05051f] to-transparent" />
    </section>
  );
};

export default HeroSection;

