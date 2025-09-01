import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Import for carousel navigation
import mapboxgl from 'mapbox-gl'; // Import Mapbox GL JS
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper components
import { Navigation, Pagination } from 'swiper/modules'; // Import Navigation module

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // Import navigation CSS
// No 'swiper/css/pagination' needed as dots are removed

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibWFzaHAxMjMiLCJhIjoiY21lZ3ZrdjBpMDFjOTJucjVtdHBpbWp6aiJ9.KNoKUUUFr1f_mC53ZjsPFg'// Using the provided token

function EHGeoHeat() {
  // Ref for the map container
  const mapContainer = useRef(null);
  const mapInstance = useRef(null); // To store the map instance

  // Dummy data for the key metrics
  const keyMetrics = [
    {
      icon: '/arrow circle.svg', // Using string to indicate icon type for SVG
      value: '85%',
      description: 'Price Prediction Accuracy',
    },
    {
      icon: '/location.svg',
      value: '120+',
      description: 'Micro-Markets Tracked',
    },
    {
      icon: '/data pionts.svg',
      value: '50M+',
      description: 'Data Points Analyzed',
    },
    {
      icon: '/real time.svg',
      value: '24/7',
      description: 'Real-time Updates',
    },
  ];

  // Dummy data for Market Insight Cards
  const marketInsights = [
    {
      id: 1,
      area: 'Whitefield',
      score: '9.2/10',
      avgPrice: '₹8,500/sq ft',
      yoyGrowth: '+18%',
    },
    {
      id: 2,
      area: 'Koramangala',
      score: '9.5/10',
      avgPrice: '₹10,200/sq ft',
      yoyGrowth: '+15%',
    },
    {
      id: 3,
      area: 'Indiranagar',
      score: '9.8/10',
      avgPrice: '₹12,000/sq ft',
      yoyGrowth: '+22%',
    },
    {
      id: 4,
      area: 'HSR Layout',
      score: '8.9/10',
      avgPrice: '₹7,800/sq ft',
      yoyGrowth: '+12%',
    },
  ];

  // Dummy data for GeoHeat Intelligence Features
  const geoHeatFeatures = [
    {
      number: '01',
      color: 'border-green-500 text-green-500',
      title: 'Buyer Interest AI Map',
      description: 'Real-time visualization of buyer search patterns and interest levels across different areas.',
      subFeatures: [
        'Heat intensity mapping',
        'Search volume analytics',
        'Buyer behavior patterns',
        'Interest trend analysis',
      ],
    },
    {
      number: '02',
      color: 'border-red-600 text-red-600',
      title: 'Price Forecasting',
      description: '85% accurate price predictions based on multiple data sources and market indicators.',
      subFeatures: [
        '6-month price forecasts',
        'Historical trend analysis',
        'Market cycle predictions',
        'ROI calculations',
      ],
    },
    {
      number: '03',
      color: 'border-orange-500 text-orange-500',
      title: 'Investment Zone Scoring',
      description: 'Comprehensive scoring system evaluating investment potential of micro-markets',
      subFeatures: [
        '10-point scoring system',
        'Infrastructure development',
        'Connectivity analysis',
        'Future growth potential',
      ],
    },
  ];

  // Dummy data for Latest Market Insights (now a carousel)
  const latestMarketInsights = [
    {
      id: 1,
      confidence: 'High Confidence',
      confidenceColor: 'bg-green-100 text-green-800',
      title: 'Whitefield Emerges as Top Investment Zone',
      description: 'GeoHeat™ analysis shows 18% YoY price growth with strong IT sector expansion',
    },
    {
      id: 2,
      confidence: 'Medium Confidence',
      confidenceColor: 'bg-orange-100 text-orange-800',
      title: 'Electronic City Phase 2 Shows Promise',
      description: 'Infrastructure development driving 15% increase in buyer interest',
    },
    {
      id: 3,
      confidence: 'High Confidence',
      confidenceColor: 'bg-green-100 text-green-800',
      title: 'Sarjapur Road: Residential Hotspot',
      description: 'Significant demand for luxury apartments, 10% rental yield growth projected.',
    },
    {
      id: 4,
      confidence: 'Medium Confidence',
      confidenceColor: 'bg-orange-100 text-orange-800',
      title: 'Commercial Hubs See Stable Growth',
      description: 'Office space absorption remains steady, attracting new businesses.',
    },
  ];

  // Function to render SVG icons based on src
  const renderIcon = (src) => (
    <img
      src={src}
      alt="Metric Icon"
      className="h-20 w-20 mb-4 filter grayscale hover:filter-none transition-all duration-300" // Apply grayscale filter
      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/E0E0E0/333333?text=Icon`; }} // Fallback
    />
  );

  // Mapbox GL JS initialization
  useEffect(() => {
    // Add Mapbox GL CSS dynamically
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    if (mapContainer.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mashp123/cmd2z8ssx00c601quhp9a77pr', // Using the provided style URL
        center: [77.5946, 12.9716], // Center on Bangalore
        zoom: 10,
      });

      mapInstance.current.on('load', () => {
        // Add source for heatmap data
        mapInstance.current.addSource('locations', {
          type: 'geojson',
          data: '/bangalore-heatmap-points.json', // Path to your GeoJSON file
        });

        // Add heatmap layer for gradient effect
        mapInstance.current.addLayer({
          id: 'heatmap-layer',
          type: 'heatmap',
          source: 'locations',
          maxzoom: 15,
          paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 1, 1], // Assuming 'intensity' property in your GeoJSON
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3], // Adjust intensity with zoom
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 0, 0)', // Transparent for no density
              0.2, '#2563eb',     // Blue (Luxury Zone)
              0.4, '#22c55e',     // Green (Emerging Area)
              0.6, '#f97316',     // Orange (Moderate Demand)
              0.8, '#e60000',     // Red (High Demand)
              1, '#e60000'        // Solid red for peak density
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20], // Adjust radius with zoom
            'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 9, 0.5], // Adjust opacity with zoom
          },
        });
      });

      // Clean up map on component unmount
      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
        document.head.removeChild(link); // Remove CSS link
      };
    }
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      {/* EH GeoHeat Hero Section */}
      <section
        className="
          relative w-full h-screen md:h-[50vh] lg:h-[80vh] /* Responsive height */
          bg-cover bg-center /* Cover the area, center the image */
          text-white /* White text for contrast */
          flex items-center justify-center /* Center content vertically and horizontally */
          overflow-hidden /* Hide any overflow from background */
        "
        style={{ backgroundImage: "url('/geo_heat_hero_bg (1).jpg')" }} /* Placeholder background image */
      >
        {/* Dark overlay for readability and color tint */}
        <div className="absolute inset-0 bg-black/40" /> {/* Simplified overlay */}

        {/* Content Container */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="
            text-4xl md:text-5xl lg:text-6xl /* Responsive font size */
            font-bold leading-tight mb-4 /* Bold, tight line-height, bottom margin */
            drop-shadow-lg /* Text shadow for better readability */
          ">
            GeoHeat™
          </h1>

          {/* Primary Tagline */}
          <p className="
            text-2xl md:text-3xl lg:text-4xl /* Responsive font size */
            font-semibold mb-8 /* Semi-bold weight, bottom margin */
            drop-shadow-md /* Text shadow */
          ">
            Live Market Intelligence for Bangalore
          </p>

          {/* Description */}
          <p className="
            text-base md:text-lg lg:text-xl /* Responsive font size */
            font-medium drop-shadow-sm /* Medium weight */
          ">
            AI-powered heatmaps and scorecards for Bangalore's micro-markets. <br />
            85% accuracy in price forecasting.
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
                className="flex flex-col items-center text-center p-4"
              >
                {/* Grayscale Icon */}
                {renderIcon(metric.icon)}

                {/* Metric Value */}
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </h3>

                {/* Metric Description */}
                <p className="text-lg text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Bangalore Market Heatmap Section */}
      <section className="bg-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-6xl font-bold text-gray-800 mb-2">
              Bangalore Market <span className="text-red-600">Heatmap</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl">
              Real-time buyer interest and price trends across Bangalore's key micro-markets.
            </p>
          </div>

          {/* Map container */}
          <div className="w-full max-w-4xl mx-auto h-[450px] rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-8">
            <div ref={mapContainer} className="w-full h-full" />
          </div>

          {/* Heatmap Legend */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16">
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-red-600 mr-2 flex-shrink-0"></span>
              <span className="text-gray-700 text-base">High Demand</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-orange-500 mr-2 flex-shrink-0"></span>
              <span className="text-gray-700 text-base">Moderate Demand</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
              <span className="text-gray-700 text-base">Emerging Area</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-600 mr-2 flex-shrink-0"></span>
              <span className="text-gray-700 text-base">Luxury Zone</span>
            </div>
          </div>

          {/* Market Insight Cards Carousel */}
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-market-insights',
                prevEl: '.swiper-button-prev-market-insights',
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-0"
            >
              {marketInsights.map((insight) => (
                <SwiperSlide key={insight.id}>
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 p-5 flex flex-col justify-between h-full text-left">
                    {/* Header with Title and Score */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{insight.area}</h3>
                      <span className="text-xs font-semibold text-green-600 border border-green-400 px-2 py-0.5 rounded-full">
                        {insight.score}
                      </span>
                    </div>

                    {/* Price and Growth */}
                    <div className="mb-5">
                      <p className="text-sm text-gray-500">Avg. Price</p>
                      <p className="text-2xl font-bold text-gray-900">{insight.avgPrice}</p>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-500">YoY Growth</p>
                      <p className="text-xl font-semibold text-green-600">{insight.yoyGrowth}</p>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-auto">
                      <button className="w-full border border-gray-300 text-gray-700 font-medium px-5 py-2 rounded-full hover:bg-gray-100 transition duration-300">
                        View detailed Analysis
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons for Market Insights Carousel */}
            {/* Desktop: left/right sides */}
            <div className="hidden md:flex justify-between absolute inset-y-0 w-full pointer-events-none">
              <button
                className="swiper-button-prev-market-insights pointer-events-auto bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition absolute left-[-40px] top-1/2 -translate-y-1/2 z-20"
                aria-label="Previous insight"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                className="swiper-button-next-market-insights pointer-events-auto bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition absolute right-[-40px] top-1/2 -translate-y-1/2 z-20"
                aria-label="Next insight"
              >
                <FiChevronRight size={24} />
              </button>
            </div>

            {/* Mobile: buttons below */}
            <div className="md:hidden flex justify-center gap-4 mt-6">
              <button className="swiper-button-prev-market-insights bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 transition">
                <FiChevronLeft size={20} />
              </button>
              <button className="swiper-button-next-market-insights bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 transition">
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* GeoHeat™ Intelligence Features Section */}
      <section className="bg-[#2A2A3F] py-16 md:py-24 px-4"> {/* Dark blue/grey background */}
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-2">
              GeoHeat™ Intelligence <span className="text-red-600">Features</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              Advanced analytics and predictive insights to make <br className="hidden sm:inline" />
              informed real estate decisions.
            </p>
          </div>

          {/* Feature Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {geoHeatFeatures.map((feature, index) => (
              <div
                key={index}
                className="
                  flex flex-col items-center text-center
                  p-6 md:p-8
                "
              >
                {/* Numbered Circle / Icon */}
                <div className={`
                  w-20 h-20 rounded-full border-2 flex items-center justify-center mb-6
                  ${feature.color} /* Dynamic border and text color */
                  text-3xl font-bold
                `}>
                  {feature.number}
                </div>
                {/* Feature Title */}
                <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                {/* Feature Description */}
                <p className="text-base text-gray-300 mb-4"> {/* Changed to gray-300 for contrast */}
                  {feature.description}
                </p>
                {/* Sub-features List */}
                <ul className="text-left space-y-1">
                  {feature.subFeatures.map((subFeature, subIndex) => (
                    <li key={subIndex} className="flex items-center text-sm text-gray-300"> {/* Changed to gray-300 for contrast */}
                      <span className="text-gray-200 mr-2 text-lg">•</span> {/* Green dot for list item */}
                      {subFeature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Market Insights Section - Using Swiper.js */}
      <section className="bg-gray-50 py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Latest Market <span className="text-red-600">Insights</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl">
              Stay updated with the latest trends and opportunities in <br className="hidden sm:inline" />
              Bangalore's real estate market.
            </p>
          </div>

          {/* Insights Carousel */}
          <div className="relative">
            <Swiper
              modules={[Navigation]} // Only Navigation module, no Pagination
              spaceBetween={24} // Space between cards
              slidesPerView={1} // Default: 1 slide per view on mobile
              navigation={{
                nextEl: '.swiper-button-next-latest-insights',
                prevEl: '.swiper-button-prev-latest-insights',
              }}
              breakpoints={{
                640: { // sm breakpoint
                  slidesPerView: 1,
                },
                768: { // md breakpoint
                  slidesPerView: 2,
                },
                1024: { // lg breakpoint
                  slidesPerView: 2, // Keep 2 as per original grid layout for this section
                },
              }}
              className="pb-0" // No padding for pagination dots
            >
              {latestMarketInsights.map((insight) => (
                <SwiperSlide key={insight.id}>
                  <div
                    className="
                      bg-white rounded-xl shadow-md p-6 md:p-8
                      text-left /* Align content left */
                      transition-all duration-300 ease-in-out
                      hover:shadow-lg hover:scale-[1.01]
                      h-full flex flex-col justify-between /* Ensure consistent height */
                    "
                  >
                    <div>
                      {/* Confidence Badge */}
                      <span className={`
                        inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4
                        ${insight.confidenceColor} /* Dynamic background and text color */
                      `}>
                        {insight.confidence}
                      </span>

                      {/* Insight Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{insight.title}</h3>
                      {/* Insight Description */}
                      <p className="text-base text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Arrows - Moved below the Swiper for all screen sizes */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                className="swiper-button-prev-latest-insights bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Previous insight"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                className="swiper-button-next-latest-insights bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                aria-label="Next insight"
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

export default EHGeoHeat;
