import React from 'react';
import { motion } from 'framer-motion'; // Import motion for animations
import {
  Clock, // For Uptime
  Rocket, // For Response Time
  Database, // For Data Points
  CheckCircle, // For Accuracy and general checklist
  Briefcase, // For Buyers
  Building, // For Sellers
  Wallet, // For Investors
} from 'lucide-react'; // Importing professional Lucide React icons (keeping only those used elsewhere)

const AiAgentEcosystem = () => {
  const assistants = [
    {
      title: 'EH Curate',
      highlight: 'Instant Property Matching',
      desc: 'AI‑powered property matching that learns from your preferences and behavior patterns to deliver perfect matches in real‑time.',
      icon: '/yield bot.svg', // Using SVG image path
    },
    {
      title: 'EH Assist',
      highlight: 'Lead Management & Follow-up',
      desc: 'Automated lead nurturing and intelligent follow‑up sequences that ensure no potential client is ever missed.',
      icon: '/property management.svg', // Using SVG image path
    },
    {
      title: 'EH Pulse',
      highlight: 'Marketing Campaign Optimization',
      desc: 'Smart ad campaign management that optimizes budget allocation and targeting for maximum ROI on builder marketing campaigns.',
      icon: '/filter orange.svg', // Using SVG image path
    },
    {
      title: 'EH RankAI',
      highlight: 'Agent Performance Tracking',
      desc: 'Comprehensive agent performance analytics with personalized coaching recommendations and goal tracking.',
      icon: '/star orange.svg', // Using SVG image path
    },
    {
      title: 'EH YieldBot',
      highlight: 'Rental Yield Optimization',
      desc: 'Predictive analytics for rental income optimization, tenant quality scoring, and renewal probability analysis.',
      icon: '/dollar.svg', // Using SVG image path

    },
    {
      title: 'EH Edge',
      highlight: 'Investment ROI Analysis',
      desc: 'Advanced investment analysis with market trend predictions, risk assessment, and portfolio optimization recommendations.',
      icon: '/robo.svg', // Using SVG image path
    },
  ];

  // Data for "Why AI-Powered Real Estate?" section
  const whyAIPoweredFeatures = [
    {
      number: "01",
      title: "24/7 Availability",
      desc: "AI agents work round the clock, ensuring no opportunity is missed",
      statValue: "100%",
      statUnit: "Uptime",
      colorClass: "text-blue-600 border-blue-600", // Blue for 01
    },
    {
      number: "02",
      title: "Instant Responses",
      desc: "Get immediate answers and property matches without waiting",
      statValue: "<1s",
      statUnit: "Response Time",
      colorClass: "text-red-600 border-red-600", // Red for 02
    },
    {
      number: "03",
      title: "Data-Driven Insights",
      desc: "Make informed decisions with comprehensive market analysis",
      statValue: "50M+",
      statUnit: "Data Points",
      colorClass: "text-orange-500 border-orange-500", // Orange for 03
    },
    {
      number: "04",
      title: "Personalized Experience",
      desc: "Each interaction is tailored to your specific needs and preferences",
      statValue: "95%",
      statUnit: "Accuracy",
      colorClass: "text-green-600 border-green-600", // Green for 04
    },
  ];


  // Framer Motion variants for animations
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay each child's animation
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-screen md:min-h-[80vh] flex items-center justify-center text-center px-6 py-20 bg-cover bg-center overflow-hidden"
        style={{
          // Using a higher resolution placeholder image for better quality
          backgroundImage: "url('/ai_agent-eco_system_hero_bg (1).png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" /> {/* Darker overlay for better contrast */}

        <div className="relative z-10 max-w-6xl mx-auto text-white"> {/* Increased max-width for content */}
          <motion.h1
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            AI Agent Ecosystem
          </motion.h1>
          <motion.p
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...fadeInVariants.visible.transition, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-10 leading-relaxed max-w-4xl mx-auto drop-shadow-md" // Adjusted font-weight and max-width
          >
            Our suite of specialized AI agents works 24/7 to enhance every aspect of your real estate experience, from property matching to investment analysis.
          </motion.p>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...staggerContainerVariants.visible.transition, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              variants={cardVariants}
              className="bg-[#040449] text-white px-8 py-2 rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              See AI in Action
            </motion.button>
            <motion.button
              variants={cardVariants}
              transition={{ ...cardVariants.transition, delay: 0.1 }}
              className="bg-transparent border-2 border-white text-white px-8 py-2 rounded-full text-lg font-semibold shadow-lg hover:bg-white hover:text-red-600 transition duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              Request Demo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* AI Assistant Team Section */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-900 leading-tight"
          >
            Meet Your <span className="text-red-600">AI Assistant Team</span>
          </motion.h2>
          <motion.p
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...fadeInVariants.visible.transition, delay: 0.2 }}
            className="text-lg md:text-xl mb-12 max-w-4xl mx-auto text-gray-600 leading-relaxed"
          >
            Each AI agent is specialized for specific real estate tasks, working together to provide unmatched service and insights.
          </motion.p>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {assistants.map((item, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="bg-white shadow-lg rounded-2xl px-6 py-8 md:px-8 md:py-10 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
              >
                {/* SVG Image Icon with grayscale filter */}
                <img
                  src={item.icon}
                  alt={item.title + ' icon'}
                  className="w-12 h-12 md:w-16 md:h-16 mb-4 filter grayscale hover:filter-none transition-all duration-300" // Apply grayscale filter
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/E0E0E0/333333?text=Icon`; }}
                />

                {/* Title */}
                <h4
                  className="text-xl md:text-2xl font-bold text-[#040449] mb-2"
                  style={{ fontFamily: "'Exo 2', sans-serif" }}
                >
                  {item.title}
                </h4>

                {/* Highlight - Using a consistent gray as specified */}
                <h5 className="font-semibold text-base md:text-lg mb-3 text-[#00171F]">
                  {item.highlight}
                </h5>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Capabilities Matrix Section */}
      <section className="bg-[#F7F8FC] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-[#1F1F1F] mb-4 leading-tight"
          >
            AI Agent Capabilities <span className="text-red-600">Matrix</span>
          </motion.h2>
          <motion.p
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...fadeInVariants.visible.transition, delay: 0.2 }}
            className="text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Comprehensive overview of each AI agent’s specialized functions and capabilities.
          </motion.p>

          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200"
          >
            <div className="min-w-[800px] bg-white"> {/* Increased min-width for better desktop table */}
              <div className="grid grid-cols-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold text-base md:text-lg py-5 px-6"> {/* Subtle gradient */}
                <div className="py-2">AI Agent</div>
                <div className="py-2">Primary Function</div>
                <div className="py-2">Key Capabilities</div>
                <div className="py-2">User Benefit</div>
              </div>

              {[
                {
                  agent: "EH Curate",
                  function: "Instant Property Matching",
                  capabilities: "ML-based preference learning, Real-time inventory sync, Behavioral pattern analysis",
                  benefit: "Find perfect properties 10x faster",
                },
                {
                  agent: "EH Assist",
                  function: "Lead Management & Follow-up",
                  capabilities: "Automated nurturing sequences, Smart response timing, Lead scoring & prioritization",
                  benefit: "Never miss a potential customer",
                },
                {
                  agent: "EH Pulse",
                  function: "Marketing Campaign Optimization",
                  capabilities: "Ad performance analysis, Budget optimization, Target audience refinement",
                  benefit: "3x better marketing ROI",
                },
                {
                  agent: "EH RankAI",
                  function: "Agent Performance Tracking",
                  capabilities: "Performance analytics, Coaching recommendations, Goal tracking & alerts",
                  benefit: "Improved agent productivity",
                },
                {
                  agent: "EH YieldBot",
                  function: "Rental Yield Optimization",
                  capabilities: "Market rent analysis, Renewal probability scoring, Tenant quality assessment",
                  benefit: "Maximize rental income",
                },
                {
                  agent: "EH Edge",
                  function: "Investment ROI Analysis",
                  capabilities: "Predictive modeling, Market trend analysis, Risk assessment scoring",
                  benefit: "Make data-driven investments",
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 gap-4 px-6 py-6 border-t border-gray-200 text-base md:text-lg bg-white hover:bg-gray-50 transition duration-200"
                >
                  <div className="font-semibold text-gray-900" style={{ fontFamily: "'Exo 2', sans-serif" }}>{row.agent}</div>
                  <div className="text-gray-700">{row.function}</div>
                  <div className="text-gray-600">{row.capabilities}</div>
                  <div>
                    <span className="bg-[#E7F0FF] text-[#262262] text-sm md:text-base font-medium px-3 py-1 rounded-full inline-block shadow-sm"> {/* Changed to red accent */}
                      {row.benefit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

     {/* Why AI-Powered Real Estate Section */}
<section className="bg-white py-24 px-6">
  <div className="max-w-7xl mx-auto text-center">
    {/* Heading */}
    <motion.h2
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-gray-900"
    >
      Why <span className="text-black">AI-Powered</span>{' '}
      <span className="text-red-600">Real Estate?</span>
    </motion.h2>

    {/* Subheading */}
    <motion.p
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ ...fadeInVariants.visible.transition, delay: 0.2 }}
      className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-16 leading-relaxed"
    >
      Experience the future of real estate with our intelligent automation and data-driven insights.
    </motion.p>

    {/* Feature Cards */}
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
    >
      {[
        {
          number: '01',
          title: '24/7 Availability',
          desc: 'AI agents work round the clock, ensuring no opportunity is missed',
          statValue: '100%',
          statUnit: 'Uptime',
          color: 'text-green-500',
          border: 'border-green-400',
        },
        {
          number: '02',
          title: 'Instant Responses',
          desc: 'Get immediate answers and property matches without waiting',
          statValue: '<1s',
          statUnit: 'Response Time',
          color: 'text-red-500',
          border: 'border-red-400',
        },
        {
          number: '03',
          title: 'Data-Driven Insights',
          desc: 'Make informed decisions with comprehensive market analysis',
          statValue: '50M+',
          statUnit: 'Data Points',
          color: 'text-orange-500',
          border: 'border-orange-400',
        },
        {
          number: '04',
          title: 'Personalized Experience',
          desc: 'Each interaction is tailored to your specific needs and preferences',
          statValue: '95%',
          statUnit: 'Accuracy',
          color: 'text-green-500',
          border: 'border-green-400',
        },
      ].map((item, idx) => (
        <motion.div
          key={idx}
          variants={cardVariants}
          className="flex flex-col justify-between text-center bg-white rounded-xl transition-all duration-300 p-8 h-full"
        >
          {/* Numbered Circle */}
          <div
            className={`w-16 h-16 rounded-full border-2 ${item.border} flex items-center justify-center mx-auto text-xl font-bold ${item.color} mb-6`}
          >
            {item.number}
          </div>

          {/* Content */}
          <div className="flex-grow">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-6 leading-snug px-2">{item.desc}</p>
          </div>

          {/* Stat Badge */}
          <div className="inline-flex flex-col items-center bg-[#F2F7FC] rounded-lg px-6 py-3 mt-auto">
            <span className="text-2xl font-bold text-[#111827]">{item.statValue}</span>
            <span className="text-sm text-gray-600 font-medium">{item.statUnit}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>


      {/* Seamless Integration Section */}
      <section className="bg-white py-20 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
          >
            <span className="text-[#1F1F1F]">Seamless </span>
            <span className="text-red-600">Integration</span>
          </motion.h2>
          <motion.p
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...fadeInVariants.visible.transition, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Our AI agents work together seamlessly, creating a unified intelligent ecosystem for all your real estate needs.
          </motion.p>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {/* Buyers */}
            <motion.div variants={cardVariants} className="p-4 bg-gray-50 rounded-xl shadow-md">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center md:text-left">
                For Buyers
              </h3>
              <ul className="space-y-3 text-base text-gray-700 pl-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/> {/* Green circle fill */}
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> {/* White checkmark */}
                  </svg>
                  Smart property matching
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Market trend alerts
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Price drop notifications
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Virtual tour scheduling
                </li>
              </ul>
            </motion.div>

            {/* Sellers */}
            <motion.div variants={cardVariants} transition={{ ...cardVariants.transition, delay: 0.1 }} className="p-4 bg-gray-50 rounded-xl shadow-md">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center md:text-left">
                For Sellers
              </h3>
              <ul className="space-y-3 text-base text-gray-700 pl-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Pricing optimization
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Marketing automation
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Lead qualification
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Performance analytics
                </li>
              </ul>
            </motion.div>

            {/* Investors */}
            <motion.div variants={cardVariants} transition={{ ...cardVariants.transition, delay: 0.2 }} className="p-4 bg-gray-50 rounded-xl shadow-md">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center md:text-left">
                For Investors
              </h3>
              <ul className="space-y-3 text-base text-gray-700 pl-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  ROI forecasting
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Market opportunity alerts
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Portfolio optimization
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Risk assessment
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AiAgentEcosystem;
