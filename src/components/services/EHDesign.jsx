import React, { useState, useEffect } from 'react'; // Import useEffect for responsive carousel
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Import icons for carousel arrows
// Removed specific Lucide React icon imports as they will be rendered as SVG images
// import { Lightbulb, Compass, Blocks, Paintbrush, CheckCircle, Star, Users, ShieldCheck, Award, Handshake } from 'lucide-react'; 

function EHDesign() {
  // Dummy data for the design services - updated to use SVG paths
  const designServices = [
    {
      icon: '/home.svg', // Path to your SVG file
      title: 'Smart Interiors',
      description: 'Technology-integrated living spaces with smart home automation',
    },
    {
      icon: '/tick mark@300x-8.png', // Path to your SVG file
      title: 'Vastu Compliant',
      description: 'Traditional principles blended with modern aesthetics',
    },
    {
      icon: '/paint.svg', // Path to your SVG file
      title: 'Modular Solutions',
      description: 'Flexible, scalable designs that grow with your needs',
    },
    {
      icon: '/home staging.svg', // Path to your SVG file
      title: 'Home Staging',
      description: 'Professional staging to maximize property appeal and value',
    },
  ];

  // Dummy data for the design process steps
  const designProcessSteps = [
    {
      number: '01',
      color: 'border-gray-700 text-gray-700', // Muted colors for elegance
      title: 'Consultation',
      description: 'Understanding your vision, lifestyle, and requirements',
    },
    {
      number: '02',
      color: 'border-gray-700 text-gray-700',
      title: 'Design Development',
      description: 'Creating detailed plans, 3D renders, and material selection',
    },
    {
      number: '03',
      color: 'border-gray-700 text-gray-700',
      title: 'Execution',
      description: 'Project management with in-house or certified partners',
    },
    {
      number: '04',
      color: 'border-gray-700 text-gray-700',
      title: 'Handover',
      description: 'Final styling, quality check, and project completion',
    },
  ];

  // Dummy data for featured projects
  const featuredProjects = [
    {
      id: 1,
      image: '/h19@300x-100.jpg', // Using provided image
      cost: '₹45L',
      title: 'Luxury Villa - Whitefield',
      type: 'Complete Home Design',
      timeline: '12 weeks',
    },
    {
      id: 2,
      image: '/h20@300x-100.jpg', // Using provided image
      cost: '₹1.2Cr',
      title: 'Corporate Office - UB City',
      type: 'Commercial Interior',
      timeline: '16 weeks',
    },
    {
      id: 3,
      image: '/h21@300x-100.jpg', // Using provided image
      cost: '₹8.5 Cr',
      title: 'Luxury Staging',
      type: 'Commercial Interior',
      timeline: '8 weeks',
    },
    {
      id: 4,
      image: '/h16@300x-100.jpg', // Using provided image
      cost: '₹2.5Cr',
      title: 'Penthouse Design',
      type: 'Residential Interior',
      timeline: '20 weeks',
    },
  ];

  // Dummy data for "Exclusive to EH Clients" benefits - updated to use SVG paths
  const clientBenefits = [
    {
      // Path to your SVG file
      title: 'Expert Team',
      description: 'In-house designers and certified partners',
    },
    {
      // Path to your SVG file
      title: 'Quality Assured',
      description: '12% commission with NDA protection',
    },
  ];

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3); // State to manage cards visible per page

  // Adjust cardsPerPage based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(1); // 1 card on mobile
      } else {
        setCardsPerPage(3); // 3 cards on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount to set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel navigation handlers
  const handleProjectPrev = () => {
    setCurrentProjectIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      // Loop back to the end if at the beginning
      return newIndex < 0 ? featuredProjects.length - cardsPerPage : newIndex;
    });
  };

  const handleProjectNext = () => {
    setCurrentProjectIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      // Loop back to the start if at the end
      return newIndex >= featuredProjects.length - cardsPerPage + 1 ? 0 : newIndex;
    });
  };

  return (
    <>
      {/* EH Design Hero Section */}
      <section
        className="
          relative w-full h-screen md:h-[80vh] lg:h-[90vh]
          bg-cover bg-center
          text-white
          flex items-center justify-center
          overflow-hidden
        "
        style={{ backgroundImage: "url('/h13@300x-100.jpg')" }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content Container */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="
            text-4xl md:text-5xl lg:text-6xl
            font-bold leading-tight mb-4
            drop-shadow-lg
          ">
            EH Design™
          </h1>

          {/* Primary Description */}
          <p className="
            text-lg md:text-xl lg:text-2xl
            font-medium mb-8
            drop-shadow-md
          ">
            Exclusive interior design services for Estate Hive clients. <br />
            Where luxury meets functionality.
          </p>

          {/* Highlighted Text Block - Restyled for elegance */}
          <div className="
            bg-white/10 border border-white/20
            text-white
            px-6 py-3 mb-8
            rounded-xl
            inline-block
            max-w-full
            mx-auto
            shadow-lg
            backdrop-blur-sm
            font-semibold text-lg
          ">
            <p>
              Exclusively available for EH property clients <br className="sm:hidden" />
              <span className="inline-block mx-2">&bull;</span> 12% commission <span className="inline-block mx-2">&bull;</span> NDA enforced
            </p>
          </div>

          {/* Call to Action Button */}
          <button className="
            bg-red-600 hover:bg-red-700
            text-white font-semibold
            px-10 py-4 rounded-full
            shadow-lg hover:shadow-xl
            transition duration-300 ease-in-out
            w-full sm:w-auto
          ">
            Get Interior Plan
          </button>
        </div>
      </section>

      {/* Our Design Services Section */}
      <section className="bg-gray-50 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-px bg-gray-300 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Our <span className="text-red-600">Design Services</span>
              </h2>
              <div className="w-16 h-px bg-gray-300 ml-4" />
            </div>
            <p className="text-gray-600 text-lg md:text-xl">
              Comprehensive interior solutions tailored for modern luxury living
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {designServices.map((service, index) => (
              <div
                key={index}
                className="
                  bg-white rounded-xl shadow-sm p-6 md:p-8
                  flex flex-col items-center text-center
                  transition-all duration-300 ease-in-out
                  hover:shadow-md hover:scale-105
                "
              >
                {/* Icon - Using img tag for SVG and applying grayscale */}
                <img
                  src={service.icon}
                  alt={service.title} // Use title as alt text for accessibility
                  className="h-20 w-20 mb-6 grayscale" // Apply grayscale filter
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/CCCCCC/333333?text=Icon`; }} // Fallback
                />
                
                {/* Service Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                {/* Service Description */}
                <p className="text-base text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Design Process Section */}
      <section className="bg-gray-100 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-px bg-gray-300 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Our <span className="text-red-600">Design Process</span>
              </h2>
              <div className="w-16 h-px bg-gray-300 ml-4" />
            </div>
            <p className="text-gray-600 text-lg md:text-xl">
              A streamlined approach to creating your dream space
            </p>
          </div>

          {/* Process Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {designProcessSteps.map((step, index) => (
              <div
                key={index}
                className="
                  flex flex-col items-center text-center
                  p-4
                "
              >
                {/* Numbered Circle */}
                <div className={`
                  w-20 h-20 rounded-full border-2 flex items-center justify-center mb-6
                  ${step.color}
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

      {/* Featured Projects Section */}
      <section className="bg-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center relative"> {/* Made relative for absolute positioning of arrows */}
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Featured <span className="text-red-600">Projects</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl">
              Recent transformations by our design team
            </p>
          </div>

          {/* Projects Carousel */}
          <div className="relative">
            <div className="overflow-hidden relative">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentProjectIndex * (100 / cardsPerPage)}%)` }}
              >
                {featuredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="
                      flex-shrink-0 w-full md:w-1/3
                      px-2 /* Added horizontal padding for spacing between cards */
                    "
                  >
                    <div className="
                      bg-white rounded-xl overflow-hidden
                      border border-gray-200
                      hover:shadow-lg transition-all duration-300 ease-in-out
                      h-full flex flex-col justify-between /* Ensure consistent height and button alignment */
                    ">
                      {(() => {
                        const ImageBlock = (
                          <div className="relative w-full h-56 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover scale-[1.2]"
                              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/E0E0E0/333333?text=Image+Error`; }}
                            />
                            <span className="
                              absolute top-3 left-3
                              bg-red-600 text-white text-xs font-semibold
                              px-3 py-1 rounded-full
                              shadow-md
                            ">
                              {project.cost}
                            </span>
                          </div>
                        );

                        const TextBlock = (
                          <div className="p-4 text-left flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 mb-1">{project.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{project.type}</p>
                              <div className="flex items-center text-sm text-gray-500 mb-4">
                                <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                <span>Timeline: {project.timeline}</span>
                              </div>
                            </div>
                            <div className="text-right mt-auto"> {/* Align button to the right and push to bottom */}
                              <button className="
                                bg-red-600 text-white font-semibold
                                px-4 py-1.5 rounded-full text-sm
                                shadow-md hover:bg-red-700 transition duration-300
                              ">
                                View Details
                              </button>
                            </div>
                          </div>
                        );

                        return index % 2 === 0 ? (
                          <>
                            {ImageBlock}
                            {TextBlock}
                          </>
                        ) : (
                          <>
                            {TextBlock}
                            {ImageBlock}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows (Desktop) */}
            <button
              onClick={handleProjectPrev}
              className="
                absolute top-1/2 left-[-40px] transform -translate-y-1/2
                bg-gray-800 text-white rounded-full p-3
                shadow-lg hover:bg-gray-700 transition duration-300
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                z-30 /* Increased z-index */
                hidden md:block
              "
              aria-label="Previous project"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={handleProjectNext}
              className="
                absolute top-1/2 right-[-40px] transform -translate-y-1/2
                bg-gray-800 text-white rounded-full p-3
                shadow-lg hover:bg-gray-700 transition duration-300
                focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                z-30 /* Increased z-index */
                hidden md:block
              "
              aria-label="Next project"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Navigation Arrows (Mobile) */}
            <div className="flex justify-center mt-8 space-x-4 md:hidden">
              <button
                onClick={handleProjectPrev}
                className="
                  bg-gray-800 text-white rounded-full p-3
                  shadow-lg hover:bg-gray-700 transition duration-300
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                "
                aria-label="Previous project"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={handleProjectNext}
                className="
                  bg-gray-800 text-white rounded-full p-3
                  shadow-lg hover:bg-gray-700 transition duration-300
                  focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                "
                aria-label="Next project"
              >
                <FiChevronRight size={24} />
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {featuredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProjectIndex(index)}
                  className={`
                    w-3 h-3 rounded-full
                    ${index === currentProjectIndex ? 'bg-gray-800' : 'bg-gray-300'}
                    transition-colors duration-300
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive to EH Clients Section */}
      <section className="bg-[#1E2235] py-16 md:py-24 px-4 text-white">
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Exclusive to <span className="text-red-500">EH Clients</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              EH Design™ services are exclusively available to Estate Hive property clients, <br className="hidden sm:inline" />
              ensuring the highest level of quality and confidentiality.
            </p>
          </div>

          {/* Benefit Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {clientBenefits.map((benefit, index) => (
              <div
                key={index}
                className="
                  bg-white rounded-xl shadow-md p-6 md:p-8
                  flex flex-col items-center text-center
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg
                "
              >
                {/* Icon - Using img tag for SVG and applying grayscale */}
                
                {/* Benefit Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                {/* Benefit Description */}
                <p className="text-base text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action Button */}
          <button className="
            bg-red-600 hover:bg-red-700
            text-white font-semibold
            px-10 py-4 rounded-full
            shadow-lg
            transition duration-300 ease-in-out
            w-full md:w-auto
          ">
            Schedule Design Consultation
          </button>
        </div>
      </section>
    </>
  );
}

export default EHDesign;
