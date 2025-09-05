import React, { useState,useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Import for carousel navigation
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { propertyService } from '../../services/propertyService';
import { formatPrice } from '../../types/property.types';
import WishlistButton from '../common/WishlistButton';

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};
function EHCommercial() {
  // Live EH Commercial listings
  const [commercialListings, setCommercialListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToCommercialList = () => {
    const target = `/properties?subcategory=eh_commercial`;
    if (user) {
      navigate(target);
    } else {
      navigate('/auth', {
        state: {
          error: 'Please sign in to view EH Commercial properties',
          from: target,
        },
      });
    }
  };
  const onViewDetails = (id) => {
    const target = `/property/${id}`;
    if (user) {
      navigate(target);
    } else {
      navigate('/auth', {
        state: {
          error: 'Please sign in to view property details',
          from: target,
        },
      });
    }
  };
  const propertyTypes = [
    {
      name: 'Office Spaces',
      image: '/h05@300x-100.jpg',
      description: 'Premium office space in Bangalore\'s business districts',
      features: [
        'IT Parks',
        'Co-working ready',
        'Furnished options',
        'Flexible lease terms',
      ],
    },
    {
      name: 'Warehousing',
      image: '/h06@300x-100.jpg',
      description: 'Spacious warehouses with seamless connectivity',
      features: [
        '24/7 access',
        'Loading docks',
        'Security systems',
        'Transportation links',
      ],
    },
    {
      name: 'Retail Spaces',
      image: '/h07@300x-100.jpg',
      description: 'High-footfall retail spaces for maximum visibility',
      features: [
        'Mall spaces',
        'Street retail',
        'Food courts',
        'Anchor locations',
      ],
    },
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setListingsLoading(true);
        const { data } = await propertyService.getAllProperties({
          status: 'active',
          subcategory: 'eh_commercial',
          sortBy: 'created_at',
          sortOrder: 'desc',
          pageSize: 12,
        });
        if (mounted) setCommercialListings(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setCommercialListings([]);
      } finally {
        if (mounted) setListingsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const toCard = (p = {}) => ({
    id: p.id,
    image: (p.image_urls && p.image_urls[0]) || '/h01@300x-100.jpg',
    title: p.title || 'Commercial Property',
    location: p.neighborhood || p.city || '',
    area: p.area_sqft ? `${p.area_sqft} sq ft` : '',
    bhk: p.bedrooms ? `${p.bedrooms}` : '',
    price: formatPrice(p.price || p.rent_amount || 0),
    is_verified: !!p.is_verified,
  });

  const shortINR = (n) => {
    const x = Number(n) || 0;
    const trim = (v) => v.toFixed(1).replace(/\.0$/, '');
    if (x >= 1e7) return `${trim(x / 1e7)} Cr`;
    if (x >= 1e5) return `${trim(x / 1e5)} L`;
    if (x >= 1e3) return `${trim(x / 1e3)}K`;
    return `${x}`;
  };

  // Dummy data for Featured Commercial Properties
  const featuredCommercialProperties = [
    {
      id: 1,
      image: '/h05@300x-100.jpg', // Placeholder image
      verified: true,
      title: 'Modern Villa Whitefield',
      location: 'Whitefield, Bangalore',
      area: '3,200 sq ft',
      bhk: '4 BHK',
      price: '₹2.8 Cr',
    },
    {
      id: 2,
      image: '/h07@300x-100.jpg', // Placeholder image
      verified: true,
      title: 'Luxury Penthouse',
      location: 'UB City, Bangalore',
      area: '4,500 sq ft',
      bhk: '5 BHK',
      price: '₹5.2 Cr',
    },
    {
      id: 3,
      image: '/h11@300x-100.jpg', // Placeholder image
      verified: true,
      title: 'Contemporary Apartment',
      location: 'Koramangala, Bangalore',
      area: '2,100 sq ft',
      bhk: '3 BHK',
      price: '₹1.9 Cr',
    },
    {
      id: 4,
      image: '/h13@300x-100.jpg', // Placeholder image
      verified: true,
      title: 'Commercial Complex',
      location: 'Electronic City, Bangalore',
      area: '8,000 sq ft',
      bhk: 'N/A', // For commercial, BHK might not apply
      price: '₹12.0 Cr',
    },
  ];

  // Dummy data for "Why Choose EH Commercial™?" benefits
  const commercialBenefits = [
    {
      icon: '/verified_property.svg', // Placeholder icon path
      title: '100% Verified Properties',
      description: 'All commercial properties go through our EH Verified™ process',
    },
    {
      icon: '/end to end.svg', // Placeholder icon path
      title: 'End-to-End Support',
      description: 'From search to lease signing, we handle everything',
    },
    {
      icon: '/market intelligence.svg', // Placeholder icon path
      title: 'Market Intelligence',
      description: 'GeoHeat™ powered insights for commercial real estate',
    },
  ];

  // Dummy data for "Our Process" steps
  const commercialProcessSteps = [
    {
      number: '01',
      color: 'border-green-500 text-green-500',
      title: 'Consultation',
      description: 'Understand your business requirements and budget',
    },
    {
      number: '02',
      color: 'border-red-500 text-red-500',
      title: 'Property Matching',
      description: 'AI-powered matching with verified commercial properties',
    },
    {
      number: '03',
      color: 'border-orange-500 text-orange-500',
      title: 'Site Visits',
      description: 'Arranged viewings with our commercial property experts',
    },
    {
      number: '04',
      color: 'border-green-500 text-green-500',
      title: 'Deal Closure',
      description: 'End-to-end support for lease negotiation and signing',
    },
  ];

  // Swiper ref for programmatic navigation
  const swiperRef = React.useRef(null);

  return (
    <>
      {/* EH Commercial Hero Section */}
      <section
  className="relative w-full min-h-[80vh] md:min-h-[80vh] text-white flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: "url('/commercial_hero_bg.jpg')",
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', // Changed to cover to fill entire width naturally
    imageRendering: 'auto',
  }}
>
  {/* Overlay for dark tint */}
  <div className="absolute inset-0 bg-black/40 z-0"></div>

  {/* Hero Content */}
  <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                  <motion.h1  
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      viewport={{ once: true }}
      className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-lg"
      style={{ fontFamily: "'Exo 2', sans-serif" }}
    >
      EH Commercial
    </motion.h1>

                  <motion.p
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      viewport={{ once: true }}
                      className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 drop-shadow-md">
      Premium Commercial Real Estate Solutions
    </motion.p>

                  <motion.p
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      viewport={{ once: true }}
                      className="text-base md:text-lg lg:text-xl font-medium mb-10 drop-shadow-sm text-gray-200">
      Verified office spaces, warehouses, and retail properties with end-to-end support and tailored matching.
    </motion.p>

    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                      <motion.button
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="bg-[#4A3B72] hover:bg-[#3A2D5B] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out w-full sm:w-auto">
        Explore Commercial Properties
      </motion.button>
                      <motion.button
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="bg-[#4A3B72] hover:bg-[#3A2D5B] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out w-full sm:w-auto">
        List your Property
      </motion.button>
    </div>
  </div>
</section>


      {/* Commercial Property Types Section */}
<section className="bg-white py-16 md:py-24 px-4">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-12">
                      <motion.h2
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Commercial <span className="text-red-600">Property Types</span>
      </motion.h2>
                      <motion.p
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="text-gray-600 text-lg md:text-xl">
        From buying and selling to renting and investing, we've got every aspect of real estate covered.
      </motion.p>
    </div>

    <div className="flex flex-col gap-16">
      {propertyTypes.map((type, index) => (
        <div
          key={index}
          className={`flex flex-col lg:flex-row ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} items-center gap-10`}
        >
              <div className="w-full lg:w-1/2 flex-shrink-0">
                  <div className="bg-white rounded-xl shadow-2xl p-6 h-full flex flex-col justify-between border border-transparent">
                      <div className="overflow-hidden mb-4 mt-2 group relative rounded-xl">
                          <motion.img
                              src={type.image}
                              alt={type.name}
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.8, ease: 'easeInOut' }}
                              className="w-full h-100 object-cover rounded-xl"
                              onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://placehold.co/400x300/E0E0E0/333333?text=Image+Error`;
                              }}
                          />
                          {/* Gradient red border on hover */}
                          <div className="absolute inset-0 rounded-xl border-l-[6px] border-b-[6px] border-transparent  group-hover:border-opacity-80 transition-all duration-700 ease-in-out pointer-events-none" />
                      </div>

                      <div className="px-2 pb-1 text-left">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{type.name}</h3>
                          <p className="text-md text-gray-600">{type.description}</p>
                      </div>
                  </div>
              </div>

              {/* 📋 Feature List */}
              <div className="w-full lg:w-1/2 text-center">
                  <div className="bg-white rounded-xl p-6">
                      {type.features.map((feature, i) => (
                          <motion.div
                              key={i}
                              whileHover={{ scale: 1.08, color: '#E7000B' }}
                              transition={{ duration: 0.4, ease: 'easeInOut' }}
                              className="text-base md:text-3xl text-gray-800 py-3 cursor-default"
                          >
                              {feature}

                              {/* Horizontal line */}
                              {i < type.features.length - 1 && (
                                  <div className="my-1">
                                      <div
                                          className="w-full h-[6px] bg-no-repeat bg-center bg-contain"
                                          style={{
                                              backgroundImage: "url('/horizontal line.png')",
                                          }}
                                      />
                                  </div>
                              )}
                          </motion.div>
                      ))}
                  </div>
              </div>

          </div>
      ))}
                  </div>
              </div>
          </section> 


      {/* Featured Commercial Properties Section (UPDATED WITH SWIPER) */}
      <section className="bg-[#2A2A3F] py-16 md:py-24 px-4">
  <div className="max-w-7xl mx-auto text-center">
    <div className="mb-12">
                      <motion.h2
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="text-3xl md:text-4xl font-bold text-white mb-2">
        Featured Commercial <span className="text-red-600">Properties</span>
      </motion.h2>
                      <motion.p
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="text-gray-300 text-lg md:text-xl">
        Hand-picked commercial spaces in Bangalore's prime business locations.
      </motion.p>
    </div>

    {/* Cards Carousel */}
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ ...fadeInVariants.visible.transition, delay: 0.3 }}
      className="relative"
    >
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-listings',
          prevEl: '.swiper-button-prev-listings',
        }}
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
        }}
        className="mySwiper listings-swiper pb-8 px-1 sm:px-4"
      >
        {commercialListings.map((prop, index) => {
          const isImageTop = index % 2 === 0;
          const listing = toCard(prop);
          const typeLabel = prop.property_type || (listing.bhk ? `${listing.bhk} BHK` : '');
          const priceLabel =
            prop?.rent_amount
              ? `${shortINR(prop.rent_amount)}/${(prop.rent_frequency || 'month').toLowerCase()}`
              : listing.price;
          return (
            <SwiperSlide key={prop.id}>
              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col justify-between w-[90%] md:w-full"
                >
                  {isImageTop && (
                    <div className="relative w-full h-[240px] md:h-[250px] lg:h-[260px] bg-gray-100 overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/h01@300x-100.jpg'; }}
                      />
                      <div className="absolute top-3 right-3 z-10">
                        <WishlistButton propertyId={prop.id} variant="floating" size="md" />
                      </div>
                      {listing.is_verified && (
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-[12px] shadow">
                          Verified
                        </span>
                      )}
                      <div className="absolute top-3 right-3 z-10">
                        <WishlistButton propertyId={prop.id} variant="floating" size="md" />
                      </div>
                      {listing.is_verified && (
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-[12px] shadow">
                          Verified
                        </span>
                      )}
                      <div className="absolute top-3 right-3 z-10">
                        <WishlistButton propertyId={prop.id} variant="floating" size="md" />
                      </div>
                      {listing.is_verified && (
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-[12px] shadow">
                          Verified
                        </span>
                      )}
                      {listing.badge && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-[12px] shadow">
                          <span style={{ fontFamily: "'Exo 2', sans-serif" }}>
                            {listing.badge.replace('™', '')}
                          </span>
                          {listing.badge.includes('™') && (
                            <sup className="text-[0.6em]">™</sup>
                          )}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 p-4 lg:p-5 text-left">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">{listing.title}</h3>
                    <div className="text-sm text-gray-600">{listing.location}</div>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-500">
                      <span className="truncate">{listing.area}</span>
                      <span className="text-right">{typeLabel}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">{priceLabel}</div>
                      <button
                        onClick={() => onViewDetails(prop.id)}
                        className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-red-700"
                        aria-label="View property details"
                      >
                        View Details
                      </button>
                    </div>
                  </div>


                  {!isImageTop && (
                    <div className="relative w-full h-[240px] md:h-[250px] lg:h-[260px] bg-gray-100 overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/h01@300x-100.jpg'; }}
                      />
                      {listing.badge && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-[12px] shadow">
                          <span style={{ fontFamily: "'Exo 2', sans-serif" }}>
                            {listing.badge.replace('™', '')}
                          </span>
                          {listing.badge.includes('™') && (
                            <sup className="text-[0.6em]">™</sup>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Scroll Buttons */}
      <div className="hidden md:flex">
        <button className="swiper-button-prev-listings absolute left-[-60px] top-1/2 -translate-y-1/2 z-30 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="swiper-button-next-listings absolute right-[-60px] top-1/2 -translate-y-1/2 z-30 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Arrows */}
      <div className="md:hidden flex justify-center gap-4 mt-6">
        <button className="swiper-button-prev-listings bg-gray-800 text-white p-2 rounded-full shadow hover:bg-red-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="swiper-button-next-listings bg-gray-800 text-white p-2 rounded-full shadow hover:bg-red-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>

    {/* CTA Button */}
    <div className="mt-16 text-center">
      <motion.button
        onClick={() => goToCommercialList()}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out w-full md:w-auto"
        aria-label="View EH Commercial properties"
      >
        View EH Commercial Properties
      </motion.button>
    </div>
  </div>
</section>

          <section className="bg-white py-16 md:py-24 px-4">
              <div className="max-w-6xl mx-auto text-center">
                  {/* Section Heading */}
                  <div className="mb-16">
                      <motion.h2
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          viewport={{ once: true }}
                          className="text-3xl md:text-6xl font-bold mb-4 text-black bg-clip-text  tracking-tight"
                          style={{ fontFamily: "'Exo 2', sans-serif" }}
                      >
                          Why Choose <span className="text-red-600">EH Commercial™</span><span className="text-red-600">?</span>
                      </motion.h2>

                      <motion.p
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          viewport={{ once: true }}
                          className="text-gray-600 text-lg md:text-xl leading-relaxed"
                      >
                          We understand commercial real estate is complex. That's why <br className="hidden sm:inline" />
                          we've simplified the process.
                      </motion.p>
                  </div>

                  {/* Benefit Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4 md:px-0">
                      {commercialBenefits.map((benefit, index) => (
                          <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.2 }}
                              viewport={{ once: true }}
                              className="bg-white  rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-6 text-center hover:scale-[1.03]"
                          >
                              {/* Icon */}
                              <div className="flex justify-center mb-4">
                                  <img
                                      src={benefit.icon}
                                      alt={benefit.title}
                                      className={`h-20 w-20 transition-all duration-500 ${benefit.title !== "100% Verified Properties" ? "grayscale" : ""
                                          } hover:grayscale-0 hover:scale-110`}
                                      onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `/verified_property@300x-8.png`;
                                      }}
                                  />
                              </div>

                              {/* Title */}
                              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                  {benefit.title}
                              </h3>

                              {/* Description */}
                              <p className="text-md text-gray-600 leading-relaxed">
                                  {benefit.description}
                              </p>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>

      {/* Our Process Section (UPDATED) */}
      <section className="bg-gray-50 py-16 md:py-24 px-4"> {/* Light grey background for the section */}
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
                      <motion.h2
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="text-3xl md:text-6xl font-bold text-gray-800 mb-2">
              Our <span className="text-red-600">Process</span>
            </motion.h2>
                      <motion.p
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
            
            className="text-gray-600 text-lg md:text-xl">
              From initial consultation to final lease signing, we guide you <br className="hidden sm:inline" />
              through every step.
            </motion.p>
          </div>

          {/* Process Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {commercialProcessSteps.map((step, index) => (
              <div
                key={index}
                className="
                  bg-white rounded-xl shadow-md p-6 md:p-8 /* Adjusted shadow */
                  flex flex-col items-center text-center
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg /* Added hover shadow */
                "
              >
                {/* Numbered Circle */}
                <div className={`
                  w-20 h-20 rounded-full border-2 flex items-center justify-center mb-6
                  ${step.color} /* Dynamic border and text color */
                  text-3xl font-bold
                `}>
                  {step.number}
                </div>
                {/* Step Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                {/* Step Description */}
                <p className="text-base text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default EHCommercial;
