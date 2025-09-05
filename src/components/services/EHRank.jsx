import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// Removed specific Lucide React icon imports as they will be rendered as SVG images
// import { Trophy, Star, LineChart, Crown, MapPin, TrendingUp, DollarSign, Clock, Users } from 'lucide-react'; 

function EHRank() {
  // Dummy data for the key metrics - updated to use SVG paths
  const keyMetrics = [
    {
      icon: '/cup.svg', // Path to your SVG file
      value: '5,200+',
      description: 'Properties Ranked',
    },
    {
      icon: '/star.svg', // Path to your SVG file
      value: '340',
      description: 'Active Agents',
    },
    {
      icon: '/data pionts.svg', // Path to your SVG file
      value: '87%',
      description: 'Avg ROI Accuracy',
    },
    {
      icon: '/crown.svg', // Path to your SVG file
      value: '24',
      description: 'Millionaire Club',
    },
  ];

  // Dummy data for top ranked properties
  const topRankedProperties = [
    {
      id: 1,
      image: '/h25@300x-100.jpg', // Using provided image
      title: 'Premium Villa in Whitefield',
      location: 'Whitefield, Bangalore',
      price: '₹4.2 Cr',
      roi: '18.5%',
      demand: '95',
      ehScore: '9.8',
    },
    {
      id: 2,
      image: '/h23@300x-100.jpg', // Using provided image
      title: 'Luxury Apartment in Koramangala',
      location: 'Koramangala, Bangalore',
      price: '₹2.8 Cr',
      roi: '16.2%',
      demand: '92',
      ehScore: '9.5',
    },
    {
      id: 3,
      image: '/h211@300x-100.jpg', // Using provided image
      title: 'Modern Penthouse in Indiranagar',
      location: 'Indiranagar, Bangalore',
      price: '₹5.5 Cr',
      roi: '20.1%',
      demand: '98',
      ehScore: '9.9',
    },
    {
      id: 4,
      image: '/h15@300x-100.jpg', // Using provided image
      title: 'Spacious Duplex in JP Nagar',
      location: 'JP Nagar, Bangalore',
      price: '₹3.1 Cr',
      roi: '15.0%',
      demand: '88',
      ehScore: '9.1',
    },
  ];

  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const carouselRef = useRef(null); // Ref for the carousel inner div
  const [cardsPerPage, setCardsPerPage] = useState(2); // State to manage cards visible per page

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(1); // 1 card on mobile
      } else {
        setCardsPerPage(2); // 2 cards on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount to set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel navigation handlers
  const handlePropertyPrev = () => {
    setCurrentPropertyIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      // Loop back to the end if at the beginning, considering cardsPerPage
      // Ensure that when looping back, we land on a valid starting index for the last set of cards
      return newIndex < 0 ? Math.max(0, topRankedProperties.length - cardsPerPage) : newIndex;
    });
  };

  const handlePropertyNext = () => {
    setCurrentPropertyIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      // Loop back to the start if at the end, considering cardsPerPage
      const maxIndex = topRankedProperties.length - cardsPerPage;
      return newIndex > maxIndex ? 0 : newIndex;
    });
  };

  // Effect to scroll carousel on index change (for desktop)
  useEffect(() => {
    if (carouselRef.current && cardsPerPage > 1) { // Only scroll programmatically on desktop
      // Calculate the scroll position based on the width of a single card plus its horizontal padding
      // Assuming all cards have the same width and padding
      const firstCard = carouselRef.current.children[0];
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const cardStyle = window.getComputedStyle(firstCard);
        const marginLeft = parseFloat(cardStyle.marginLeft);
        const marginRight = parseFloat(cardStyle.marginRight);
        const totalCardWidth = cardWidth + marginLeft + marginRight; // Include any margins
        carouselRef.current.scrollLeft = currentPropertyIndex * totalCardWidth;
      }
    }
  }, [currentPropertyIndex, cardsPerPage]);


  return (
    <>
      {/* EH Rank Hero Section */}
      <section
        className="
          relative w-full h-screen md:h-[80vh] lg:h-[80vh]
          bg-cover bg-center
          text-white
          flex items-center justify-center
          overflow-hidden
        "
        style={{ backgroundImage: "url('/h15@300x-100.jpg')" }}
      >
        {/* Dark overlay for readability and color tint */}
        <div className="absolute inset-0 bg-black/40" /> {/* Increased opacity for better contrast */}

        {/* Content Container */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="
            text-4xl md:text-5xl lg:text-6xl
            font-bold leading-tight mb-4
            drop-shadow-lg
          ">
            EH Rank™
          </h1>

          {/* Primary Tagline */}
          <p className="
            text-2xl md:text-3xl lg:text-4xl
            font-semibold mb-8
            drop-shadow-md
          ">
            Every listing and agent scored for transparency
          </p>

          {/* Key Features/Benefits */}
          <p className="
            text-base md:text-lg lg:text-xl
            font-medium mb-2
            drop-shadow-sm
          ">
            ROI predictions &bull; Demand analytics &bull; Closure velocity
          </p>
          <p className="
            text-base md:text-lg lg:text-xl
            font-medium drop-shadow-sm
          ">
            Agent performance tracking
          </p>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="bg-white py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {keyMetrics.map((metric, index) => (
              <div
                key={index}
                className="
                  flex flex-col items-center text-center
                  p-4
                "
              >
                {/* Icon - Using img tag for SVG and applying grayscale */}
                <img
                  src={metric.icon}
                  alt={metric.description} // Use description as alt text for accessibility
                  className="h-24 w-24 mb-6 grayscale" // Apply grayscale filter
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/CCCCCC/333333?text=Icon`; }} // Fallback
                />
                
                {/* Metric Value */}
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </h3>
                {/* Metric Description */}
                <p className="text-lg text-gray-600">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Ranked Properties Section */}
      <section className="bg-[#2A2A3F] py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center relative"> {/* Made relative for absolute positioning of arrows */}
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Top Ranked <span className="text-red-600">Properties</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              Properties ranked by ROI potential, demand index, and closure velocity.
            </p>
          </div>

          {/* Properties Carousel */}
          <div className="relative">
            <div className="overflow-hidden relative">
              <div
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-in-out md:transform-none
                           overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth
                           w-full pb-4 md:justify-center
                "
                style={cardsPerPage === 1 ? {} : { transform: `translateX(${-currentPropertyIndex * (100 / cardsPerPage)}%)` }}
              >
                {topRankedProperties.map((property) => (
                  <div
                    key={property.id}
                    className={`
                      flex-shrink-0
                      w-full /* Full width on mobile */
                      md:w-1/2 /* 1/2 width on desktop */
                      snap-center
                      px-2 /* Horizontal padding for spacing between cards */
                    `}
                  >
                    <div className="
                      bg-white rounded-xl shadow-lg overflow-hidden
                      flex flex-col md:flex-row /* Stack on mobile, row on desktop */
                      items-stretch /* Stretch items to fill height */
                      border border-gray-200
                      hover:shadow-xl transition-all duration-300 ease-in-out
                      h-full /* Ensure cards take full height of their flex container */
                    ">
                      {/* Property Image */}
                      <div className="w-full md:w-1/3 h-48 md:h-auto md:min-h-[180px] overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x180/E0E0E0/333333?text=Image+Error`; }}
                        />
                      </div>

                      {/* Property Content */}
                      <div className="p-4 flex-grow flex flex-col justify-between text-left">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{property.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                          
                          {/* Metrics Row with Icons */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                            <div className="flex items-center">
                              {/* Using placeholder SVG for DollarSign */}
                              <svg className="h-4 w-4 text-gray-700 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L19 10m-6-2a6.002 6.002 0 00-2.592 1L5 10m6 2a6.002 6.002 0 00-2.592 1L5 14m6 2a6.002 6.002 0 00-2.592 1L5 18m14-4a6.002 6.002 0 00-2.592-1L19 14m-6 2a6.002 6.002 0 00-2.592-1L19 18M12 6v.01M12 18v.01"></path></svg>
                              <span className="font-bold text-gray-900">{property.price}</span>
                            </div>
                            <div className="flex items-center">
                              {/* Using placeholder SVG for TrendingUp */}
                              <svg className="h-4 w-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6m0 0l-3-3m3 3l-3 3m-9 4h6m0 0l-3 3m3-3l-3-3"></path></svg>
                              <span className="font-bold text-green-600">ROI: {property.roi}</span>
                            </div>
                            <div className="flex items-center">
                              {/* Using placeholder SVG for Users */}
                              <svg className="h-4 w-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0l-2 2v-4m2 2l2 2v-4m-4 0h4"></path></svg>
                              <span className="font-bold text-blue-600">Demand: {property.demand}</span>
                            </div>
                            <div className="flex items-center">
                              {/* Using placeholder SVG for Clock */}
                              {/* <svg className="h-4 w-4 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> */}
                              {/* <span className="font-bold text-red-600">Closure: {property.closure}</span> */}
                            </div>
                          </div>
                        </div>

                        {/* EH Score */}
                        <div className="flex items-center justify-end md:justify-start mt-4 md:mt-0">
                          <div className="text-right md:text-left">
                            <span className="text-4xl font-bold text-orange-500 block leading-none">{property.ehScore}</span>
                            <span className="text-sm text-gray-700">EH Score</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows (Desktop) */}
            <button
              onClick={handlePropertyPrev}
              className="
                absolute top-1/2 left-[-60px] transform -translate-y-1/2
                bg-gray-800 text-white rounded-full p-3
                shadow-lg hover:bg-gray-700 transition duration-300
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                z-30 /* Increased z-index */
                hidden md:block
              "
              aria-label="Previous property"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={handlePropertyNext}
              className="
                absolute top-1/2 right-[-60px] transform -translate-y-1/2
                bg-gray-800 text-white rounded-full p-3
                shadow-lg hover:bg-gray-700 transition duration-300
                focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                z-30 /* Increased z-index */
                hidden md:block
              "
              aria-label="Next property"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Mobile Arrows */}
            <div className="flex justify-center mt-6 space-x-4 md:hidden">
              <button
                onClick={handlePropertyPrev}
                className="bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700"
                aria-label="Previous property"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={handlePropertyNext}
                className="bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700"
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

export default EHRank;
