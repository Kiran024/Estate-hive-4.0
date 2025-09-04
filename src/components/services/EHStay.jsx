
 import React, { useEffect, useMemo, useState } from 'react';    
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Corrected import for carousel arrows
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper components
import { Navigation } from 'swiper/modules'; // Import Navigation module

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // Import navigation CSS


import 'swiper/css/navigation'; // Import navigation CSS
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import WishlistButton from '../common/WishlistButton';
import { propertyService } from '../../services/propertyService';

const PLACEHOLDER = '/h01@300x-100.jpg';

// Prefer higher resolution image URLs for signed-in users where possible
const deriveHighRes = (url) => {
  if (!url || typeof url !== 'string') return url;
  try {
    let out = url;
    out = out.replace(/@300x-\d+/g, '@1080x-100');
    out = out.replace(/@300x/g, '@1080x');
    return out;
  } catch {
    return url;
  }
};

// Build a responsive srcSet from a base URL following the @{width}x- pattern
const buildSrcSetFromUrl = (url) => {
  if (!url || typeof url !== 'string') return undefined;
  const match = url.match(/@(\d+)x(-\d+)?/);
  if (!match) return undefined;
  const widths = [480, 768, 1080, 1440];
  const unique = new Map();
  widths.forEach((w) => {
    const candidate = url
      .replace(/@\d+x-\d+/g, `@${w}x-100`)
      .replace(/@\d+x/g, `@${w}x`);
    unique.set(w, candidate);
  });
  return Array.from(unique.entries())
    .map(([w, u]) => `${u} ${w}w`)
    .join(', ');
};

const pickBestImage = (raw, fallback) => {
  try {
    const arr = Array.isArray(raw?.image_urls)
      ? raw.image_urls
      : Array.isArray(raw?.images)
      ? raw.images
      : Array.isArray(raw?.image)
      ? raw.image
      : [];
    let chosen = arr.find((u) => typeof u === 'string' && /@1080x|@1200x|@1920x/.test(u))
      || arr.find((u) => typeof u === 'string' && !/@300x/.test(u))
      || arr[0];
    return deriveHighRes(chosen || fallback);
  } catch {
    return fallback;
  }
};
function EHStay() {
  const { user } = useAuth();
  const isGuest = !user;
  const navigate = useNavigate(); 
  // Dummy data for "For Property Owners" numbered features
  const ownerFeatures = [
    {
      number: '01',
      color: 'border-green-500 text-green-500',
      title: 'Premium Listing',
      description: 'Professional photography and premium placement',
    },
    {
      number: '02',
      color: 'border-red-500 text-red-500',
      title: 'Verified Guests',
      description: 'All guests verified through our rigorous process',
    },
    {
      number: '03',
      color: 'border-orange-500 text-orange-500',
      title: 'Concierge Service',
      description: '24/7 guest support and property management',
    },
  ];
  // Dummy data for Owner Benefits checklist
  const ownerBenefitsChecklist = [
    'Professional photography and staging',
    'Dynamic pricing optimization',
    'Guest screening and verification',
    '24/7 guest support and concierge',
    'Professional cleaning and maintenance',
    'Corporate travel partnerships',
  ];

  // Dummy data for "For Guests" features
  const guestFeatures = [
    {
      title: 'Curated Boutique Homes',
      description: 'Handpicked properties with unique design and amenities',
    },
    {
      title: 'Local Experiences',
      description: 'Live like a local with insider recommendations and support',
    },
    {
      title: 'Flexible Stays',
      description: 'Short-term and extended stays for business or leisure',
    },
  ];

  // Live Luxury Rentals (lease) for Featured Stays
  const [stays, setStays] = useState([]);
  const [loadingStays, setLoadingStays] = useState(true);
  const [staysError, setStaysError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setLoadingStays(true);
        setStaysError('');
        const { data, error } = await propertyService.getAllProperties({
          status: 'active',
          category: 'lease',
          sortBy: 'created_at',
          sortOrder: 'desc',
          pageSize: 48,
        });
        if (cancelled) return;
        if (error) throw new Error(error);
        setStays(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          setStays([]);
          setStaysError(e?.message || 'Failed to load Featured Stays');
        }
      } finally {
        if (!cancelled) setLoadingStays(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  const normalizedStays = useMemo(() =>
    stays.map((p, idx) => {
      const title = p.title || 'Untitled Property';
      const location = [p.neighborhood, p.city].filter(Boolean).join(', ');
      const primary = p.image_urls?.[0] || p.featured_image || p.image || PLACEHOLDER;
      return {
        id: p.id,
        title,
        location,
        price: p.price || p.rent_amount || '',
        image: primary,
        raw: p,
        idx,
      };
    })
  , [stays]);
  // Dummy data for Featured Stays properties
  const featuredStaysProperties = [
    {
      id: 1,
      image: '/h14@300x-100.jpg', // Placeholder image
      pricePerNight: '₹8,500/night',
      title: 'Designer Loft in Indiranagar',
      location: 'Indiranagar, Bangalore',
      rating: '4.9',
      reviews: '127 reviews',
    },
    {
      id: 2,
      image: '/h15@300x-100.jpg', // Placeholder image
      pricePerNight: '₹12,000/night',
      title: 'Luxury Apartment in Koramangala',
      location: 'Koramangala, Bangalore',
      rating: '4.8',
      reviews: '89 reviews',
    },
    {
      id: 3,
      image: '/h16@300x-100.jpg', // Placeholder image
      pricePerNight: '₹8,500/night',
      title: 'Corporate Suite in Whitefield',
      location: 'Whitefield, Bangalore',
      rating: '4.9',
      reviews: '156 reviews',
    },
    {
      id: 4,
      image: '/h17@300x-100.jpg', // Placeholder image
      pricePerNight: '₹10,000/night',
      title: 'Boutique Villa in Sarjapur',
      location: 'Sarjapur, Bangalore',
      rating: '4.7',
      reviews: '98 reviews',
    },
  ];

  return (
    <>
      {/* EH Stay Hero Section */}
      <section
        className="
          relative w-full h-screen md:h-[80vh] lg:h-[80vh] /* Responsive height */
          bg-cover bg-center /* Cover the area, center the image */
          text-white /* White text for contrast */
          flex items-center justify-center /* Center content vertically and horizontally */
          overflow-hidden /* Hide any overflow from background */
        "
        style={{ backgroundImage: "url('/eh_stay_hero_bg (1).png')" }} /* Placeholder background image */
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40 bg-opacity-60" /> {/* Darker overlay for better contrast */}

        {/* Content Container */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="
            text-4xl md:text-5xl lg:text-6xl /* Responsive font size */
            font-bold leading-tight mb-4
          ">
            EH Stay™
          </h1>

          {/* Primary Taglines */}
          <p className="
            text-lg md:text-xl lg:text-2xl /* Responsive font size */
            font-medium mb-6 /* Medium weight, bottom margin */
          ">
            Boutique short-term rentals for discerning travelers.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="
              bg-[#6B4E9B] hover:bg-[#5A4182] /* Purple background, darker on hover */
              text-white font-semibold /* White text, semi-bold */
              px-8 py-3 rounded-full /* Generous padding, fully rounded */
              shadow-lg /* Base shadow */
              shadow-[0_0_0_2px_#FF6B00] /* Red/orange outline shadow */
              hover:shadow-[0_0_0_3px_#FF6B00] /* Thicker outline on hover */
              transition duration-300 ease-in-out /* Smooth transitions */
              w-full sm:w-auto /* Full width on mobile, auto width on desktop */
            ">
              Book a Stay
            </button>
            <button className="
              bg-[#4A3B72] hover:bg-[#3A2D5B] /* Darker purple background, darker on hover */
              text-white font-semibold
              px-8 py-3 rounded-full
              shadow-lg hover:shadow-xl
              transition duration-300 ease-in-out
              w-full sm:w-auto
            ">
              List Your Property
            </button>
          </div>
        </div>
      </section>

      {/* For Property Owners Section */}
      <section className="bg-gray-50 py-16 md:py-24 px-4"> {/* Light grey background */}
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              For Property <span className="text-red-600">Owners</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl">
              Transform your premium property into a profitable short-term rental <br className="hidden sm:inline" />
              with our comprehensive management service.
            </p>
          </div>

          {/* Numbered Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16"> {/* Added bottom margin */}
            {ownerFeatures.map((feature, index) => (
              <div
                key={index}
                className="
                  bg-white rounded-xl shadow-sm p-6 md:p-8
                  flex flex-col items-center text-center
                  transition-all duration-300 ease-in-out
                  hover:shadow-md hover:scale-105
                "
              >
                {/* Numbered Circle */}
                <div className={`
                  w-20 h-20 rounded-full border-2 flex items-center justify-center mb-6
                  ${feature.color} /* Dynamic border and text color */
                  text-3xl font-bold
                `}>
                  {feature.number}
                </div>
                {/* Feature Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                {/* Feature Description */}
                <p className="text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Owner Benefits Checklist Card */}
          <div className="
            bg-white rounded-xl shadow-md p-8 md:p-12
            text-left /* Align content left */
            max-w-4xl mx-auto /* Limit width and center */
          ">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
              Owner Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {ownerBenefitsChecklist.map((benefit, index) => (
                <div key={index} className="flex items-start text-gray-700">
                  {/* Green Checkmark Icon */}
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <p className="text-base">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Guests Section */}
      <section className="bg-gray-50 py-16 md:py-24 px-4"> {/* Light grey background */}
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              For <span className="text-red-600">Guests</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl">
              Experience Bangalore like a local in our carefully curated boutique properties.
            </p>
          </div>

          {/* Feature Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {guestFeatures.map((feature, index) => (
              <div
                key={index}
                className={`
                  flex flex-col items-center text-center
                  p-4 /* Padding around content */
                  ${index < guestFeatures.length - 1 ? 'md:border-r md:border-gray-300' : ''} /* Vertical separator */
                `}
              >
                {/* Feature Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                {/* Feature Description */}
                <p className="text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stays Section */}
      <section className="bg-[#2A2A3F] py-16 md:py-24 px-4"> {/* Dark blue/grey background */}
        <div className="max-w-7xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Featured <span className="text-red-600">Stays</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              Discover our handpicked collection of boutique properties
            </p>
          </div>

          {/* Properties Carousel - Using Swiper.js */}
          <div className="relative">
            <Swiper
              modules={[Navigation]} // Only Navigation module, no Pagination
              spaceBetween={24} // Space between cards
              slidesPerView={1} // Default: 1 slide per view on mobile
              navigation={{
                nextEl: '.swiper-button-next-stays',
                prevEl: '.swiper-button-prev-stays',
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation = swiper.params.navigation || {};
                swiper.params.navigation.prevEl = '.swiper-button-prev-stays';
                swiper.params.navigation.nextEl = '.swiper-button-next-stays';
              }}
              onAfterInit={(swiper) => {
                try { swiper.navigation.init(); swiper.navigation.update(); } catch {}
              }}
              breakpoints={{
                640: { // sm breakpoint
                  slidesPerView: 1,
                },
                768: { // md breakpoint
                  slidesPerView: 2,
                },
                1024: { // lg breakpoint
                  slidesPerView: 3,
                },
              }}
              className="pb-0" // No padding for pagination dots
            >
      {normalizedStays.map((property, index) => {
    const imgFirst = index % 2 === 0;
    const ImageBlock = (
      <div className="relative w-full h-56 md:h-60 lg:h-64 bg-gray-100">
        {user ? (
          <img
            src={pickBestImage(property.raw, property.image) || PLACEHOLDER}
            srcSet={buildSrcSetFromUrl(pickBestImage(property.raw, property.image))}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            alt={property.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
        ) : (
          <img
            src={property.image || PLACEHOLDER}
            alt={property.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
        )}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton propertyId={property.id} variant="floating" size="sm" />
        </div>
      </div>
    );
    const TextBlock = (
      <div className="flex flex-col gap-2 p-4 lg:p-5 text-left">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">{property.title}</h3>
        <div className="text-sm text-gray-600">{property.location}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold text-gray-900">{property.price}</div>
          <button
            onClick={() => {
              if (isGuest) return navigate('/auth');
              navigate(`/property/${property.id}`);
            }}
            className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-red-700"
          >
            View Details
          </button>
        </div>
      </div>
    );
              return (
                <SwiperSlide key={property.id}>
                  <div className="h-full w-full">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
                      {imgFirst ? (
                        <React.Fragment>
                          {ImageBlock}
                          {TextBlock}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {TextBlock}
                          {ImageBlock}
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Arrows - Desktop */}
          <div className="hidden md:flex justify-between absolute inset-y-0 w-full pointer-events-none">
            <button
              className="swiper-button-prev-stays pointer-events-auto bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition absolute left-[-40px] top-1/2 -translate-y-1/2 z-20"
              aria-label="Previous property"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              className="swiper-button-next-stays pointer-events-auto bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition absolute right-[-40px] top-1/2 -translate-y-1/2 z-20"
              aria-label="Next property"
            >
              <FiChevronRight size={24} />
            </button>
          </div>

          {/* Navigation Arrows - Mobile */}
          <div className="md:hidden flex justify-center mt-8 space-x-4">
            <button
              className="swiper-button-prev-stays bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition"
              aria-label="Previous property"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              className="swiper-button-next-stays bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition"
              aria-label="Next property"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* View EH Stay Properties CTA */}
    <section className="bg-[#2A2A3F] px-4 pb-16 overflow-hidden">
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            if (isGuest) return navigate('/auth');
            navigate('/properties?category=lease');
          }}
          className="px-6 py-3 rounded-full font-semibold bg-red-600 text-white shadow-md hover:bg-red-700"
        >
          View EH Stay Properties
        </button>
      </div>
    </section>
    </>
  );
}



export default EHStay;
