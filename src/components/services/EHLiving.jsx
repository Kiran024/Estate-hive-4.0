// EHLiving.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function EHLiving() {
  // ===== Owners features (unchanged) =====
  const ownerFeatures = [
    {
      icon: '/verified tenats.svg',
      title: 'Verified Tenants Only',
      description:
        'Background verification, income proof, and previous landlord references for every tenant.',
      subFeatures: [
        'Credit score check',
        'Employment verification',
        'Previous rental history',
        'Police verification',
      ],
    },
    {
      icon: '/yield bot.svg',
      title: 'YieldBot™ Predictions',
      description:
        'AI-powered rent optimization and renewal predictions to maximize your property income.',
      subFeatures: [
        'Market rent analysis',
        'Renewal probability',
        'Yield optimization',
        'Vacancy predictions',
      ],
    },
    {
      icon: '/property management.svg',
      title: 'Full Property Management',
      description:
        'Complete hands-off experience with our PMS concierge handling everything.',
      subFeatures: [
        'Tenant onboarding',
        'Maintenance coordination',
        'Rent collection',
        'Legal compliance',
      ],
    },
  ];

  // ===== Search controls (unchanged) =====
  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad'];
  const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
  const budgetOptions = [
    '₹10,000 - ₹25,000',
    '₹25,000 - ₹50,000',
    '₹50,000 - ₹1,00,000',
    '₹1,00,000+',
  ];

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBHK, setSelectedBHK] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [bhkDropdownOpen, setBHKDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLocationDropdownOpen(false);
        setBHKDropdownOpen(false);
        setBudgetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== Available properties =====
  // TIP: add imageHd: '/path/to/1920x1080.jpg' for crisp 1080p
  const availableProperties = [
    {
      id: 1,
      image: '/h001@300x-100.jpg',
      // imageHd: '/h001@1920x1080.jpg',
      verified: true,
      title: 'Luxury 3BHK in Whitefield',
      location: 'Whitefield, Bangalore',
      price: '₹85,000/month',
      deposit: '₹2.5L',
      beds: '3 Bed',
      baths: '3 Bath',
      area: '1,800 sq ft',
    },
    {
      id: 2,
      image: '/h002@300x-100.jpg',
      // imageHd: '/h002@1920x1080.jpg',
      verified: true,
      title: 'Modern 2BHK in Koramangala',
      location: 'Koramangala, Bangalore',
      price: '₹65,000/month',
      deposit: '₹1.8L',
      beds: '2 Bed',
      baths: '2 Bath',
      area: '1,200 sq ft',
    },
    {
      id: 3,
      image: '/h003@300x-100.jpg',
      // imageHd: '/h003@1920x1080.jpg',
      verified: true,
      title: 'Executive 4BHK in HSR Layout',
      location: 'HSR Layout, Bangalore',
      price: '₹1,20,000/month',
      deposit: '₹3.5L',
      beds: '4 Bed',
      baths: '4 Bath',
      area: '2,400 sq ft',
    },
    {
      id: 4,
      image: '/h004@300x-100.jpg',
      // imageHd: '/h004@1920x1080.jpg',
      verified: true,
      title: 'Spacious Villa in Sarjapur',
      location: 'Sarjapur, Bangalore',
      price: '₹95,000/month',
      deposit: '₹2.8L',
      beds: '3 Bed',
      baths: '4 Bath',
      area: '2,000 sq ft',
    },
  ];

  return (
    <>
      {/* ===== Hero ===== */}
      <section
        className="
          relative w-full h-screen md:h-[50vh] lg:h-[80vh]
          bg-contain bg-center text-white flex items-center justify-center overflow-hidden
        "
        style={{ backgroundImage: "url('/eh_living_hero_bg (1).png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            EH Living™
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8">
            Fully managed long-term rentals
          </p>
          <p className="text-base md:text-lg lg:text-xl font-medium mb-2">
            For Owners: 10% fee or flat retainer &bull; Verified tenants &bull; YieldBot predictions
          </p>
          <p className="text-base md:text-lg lg:text-xl font-medium">
            For Tenants: Zero brokerage &bull; Maintenance included &bull; Easy renewals
          </p>
        </div>
      </section>

      {/* ===== Owners choose section ===== */}
      <section className="bg-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Why Property Owners Choose <span className="text-red-600">EH Living™</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl">
              Complete rental management with verified tenants and AI-powered yield optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {ownerFeatures.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="h-20 w-20 mb-6 grayscale"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://placehold.co/80x80/CCCCCC/333333?text=Icon';
                  }}
                />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600 mb-4">{feature.description}</p>
                <ul className="text-left w-full max-w-xs mx-auto space-y-1">
                  {feature.subFeatures.map((sub, j) => (
                    <li key={j} className="flex items-center text-gray-600 text-base">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition w-full md:w-auto mb-16">
            Get My Property Managed
          </button>

          {/* ===== Search bar ===== */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              I'm Looking to <span className="text-red-600">Rent</span>
            </h2>

            <div
              ref={dropdownRef}
              className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center bg-[#EBF2F7] rounded-[12px] p-3 gap-3 md:gap-0 md:justify-between"
            >
              {/* Location */}
              <div className="flex-1 w-full md:w-auto relative">
                <div
                  className="px-4 py-3 flex justify-between items-center cursor-pointer text-gray-700 text-base font-medium"
                  onClick={() => {
                    setLocationDropdownOpen((v) => !v);
                    setBHKDropdownOpen(false);
                    setBudgetDropdownOpen(false);
                  }}
                >
                  {selectedLocation || 'Location'}
                  <FiChevronDown size={18} className="text-gray-600" />
                </div>
                {locationDropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-white rounded-xl py-1 mt-2 z-50">
                    {locations.map((loc) => (
                      <div
                        key={loc}
                        className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationDropdownOpen(false);
                        }}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BHK */}
              <div className="flex-1 w-full md:w-auto relative">
                <div
                  className="px-4 py-3 flex justify-between items-center cursor-pointer text-gray-700 text-base font-medium"
                  onClick={() => {
                    setBHKDropdownOpen((v) => !v);
                    setLocationDropdownOpen(false);
                    setBudgetDropdownOpen(false);
                  }}
                >
                  {selectedBHK || 'BHK'}
                  <FiChevronDown size={18} className="text-gray-600" />
                </div>
                {bhkDropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-lg py-1 mt-2 z-50">
                    {bhkOptions.map((bhk) => (
                      <div
                        key={bhk}
                        className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedBHK(bhk);
                          setBHKDropdownOpen(false);
                        }}
                      >
                        {bhk}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="flex-1 w-full md:w-auto relative">
                <div
                  className="px-4 py-3 flex justify-between items-center cursor-pointer text-gray-700 text-base font-medium"
                  onClick={() => {
                    setBudgetDropdownOpen((v) => !v);
                    setLocationDropdownOpen(false);
                    setBHKDropdownOpen(false);
                  }}
                >
                  {selectedBudget || 'Budget'}
                  <FiChevronDown size={18} className="text-gray-600" />
                </div>
                {budgetDropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-lg py-1 mt-2 z-50">
                    {budgetOptions.map((b) => (
                      <div
                        key={b}
                        className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedBudget(b);
                          setBudgetDropdownOpen(false);
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full md:w-auto">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-8 py-3 rounded-full shadow-md hover:shadow-lg w-full">
                  Search Homes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Available properties (Alternating cards) ===== */}
      <section className="bg-[#2A2A3F] py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Available <span className="text-red-600">EH Living™ Properties</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              Zero brokerage &bull; Verified properties &bull; Maintenance included
            </p>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-properties',
                prevEl: '.swiper-button-prev-properties',
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-0"
            >
              {availableProperties.map((property, idx) => {
                const reverse = idx % 2 === 1; // 2nd, 4th, ... => text on top, image bottom
                return (
                  <SwiperSlide key={property.id}>
                    <article
                      className={`
                        group bg-white border border-gray-200 rounded-xl shadow-sm
                        hover:shadow-lg transition-all duration-300 ease-in-out
                        h-full flex ${reverse ? 'flex-col-reverse' : 'flex-col'}
                      `}
                    >
                      {/* IMAGE block (kept separate; flex order controlled by container) */}
                      <figure className="relative w-full">
                        <img
                          src={property.image}
                          srcSet={
                            property.imageHd
                              ? `${property.image} 1x, ${property.imageHd} 2x`
                              : undefined
                          }
                          sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                          width={1920}
                          height={1080}
                          decoding="async"
                          loading={idx < 2 ? 'eager' : 'lazy'}
                          alt={property.title}
                          className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://placehold.co/1280x720/E0E0E0/333333?text=Image';
                          }}
                        />
                        {property.verified && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                            EH Verified™
                          </span>
                        )}
                      </figure>

                      {/* TEXT block */}
                      <div className="p-4 text-left flex flex-col">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                            {property.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                            {property.location}
                          </p>

                          <div className="flex items-end justify-between gap-3 mb-4">
                            <div>
                              <span className="block text-xl font-bold text-gray-900">
                                {property.price}
                              </span>
                              <span className="text-sm text-gray-500">
                                Deposit: {property.deposit}
                              </span>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <span>
                                {property.beds} &bull; {property.baths}
                              </span>
                              <br />
                              <span>{property.area}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="mt-auto w-full bg-red-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-red-700 transition"
                          aria-label={`Schedule visit for ${property.title}`}
                        >
                          Schedule Visit
                        </button>
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Desktop arrows */}
            <div className="hidden md:flex justify-between absolute inset-y-0 w-full pointer-events-none">
              <button
                className="swiper-button-prev-properties pointer-events-auto bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition absolute left-[-40px] top-1/2 -translate-y-1/2 z-20"
                aria-label="Previous property"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                className="swiper-button-next-properties pointer-events-auto bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition absolute right-[-40px] top-1/2 -translate-y-1/2 z-20"
                aria-label="Next property"
              >
                <FiChevronRight size={24} />
              </button>
            </div>

            {/* Mobile arrows */}
            <div className="md:hidden flex justify-center mt-8 space-x-4">
              <button
                className="swiper-button-prev-properties bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition"
                aria-label="Previous property"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                className="swiper-button-next-properties bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition"
                aria-label="Next property"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EHLiving;