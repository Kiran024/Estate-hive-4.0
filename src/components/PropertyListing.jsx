// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { motion as Motion } from 'framer-motion';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';

// //SwiperCore.use([Navigation]);

// const PropertyListing = ({ listings = [] }) => {
//     const [activeTabIndex, setActiveTabIndex] = useState(0);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const swiperRef = useRef(null);

//     const tabOptions = ['For Sale', 'For Rent', 'Luxury Rentals', 'EH Signature™'];
//     const activeTab = tabOptions[activeTabIndex];

//     const filteredListings = useMemo(() => {
//         const source = Array.isArray(listings) ? listings : [];
//         const matching = source.filter((listing) => listing.category === activeTab);
//         if (matching.length === 0) return [];
//         const repeated = [];
//         while (repeated.length < 12) {
//             repeated.push(...matching);
//         }
//         return repeated.slice(0, 12);
//     }, [listings, activeTab]);

//     const slidesPerView = 3;
//     const totalSlides = Math.ceil(filteredListings.length / slidesPerView);

//     const handlePrev = () => {
//         if (currentSlide > 0) {
//             swiperRef.current?.swiper.slidePrev();
//             setCurrentSlide((prev) => prev - 1);
//         } else {
//             const prevTab = (activeTabIndex - 1 + tabOptions.length) % tabOptions.length;
//             setActiveTabIndex(prevTab);
//             setCurrentSlide(0);
//         }
//     };

//     const handleNext = () => {
//         if (currentSlide < totalSlides - 1) {
//             swiperRef.current?.swiper.slideNext();
//             setCurrentSlide((prev) => prev + 1);
//         } else {
//             const nextTab = (activeTabIndex + 1) % tabOptions.length;
//             setActiveTabIndex(nextTab);
//             setCurrentSlide(0);
//         }
//     };

//     useEffect(() => {
//         setCurrentSlide(0);
//     }, [activeTabIndex]);

//     const fadeInVariants = {
//         hidden: { opacity: 0, y: 30 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             transition: { duration: 0.6, ease: 'easeOut' },
//         },
//     };

//     return (
//         <section className="relative bg-white py-20 px-4 z-30">
//             <div className="max-w-7xl mx-auto relative z-20">
//                 {/* Tabs */}
//                 <Motion.div
//                     variants={fadeInVariants}
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true }}
//                     className="flex justify-center mb-10 md:mb-16 mt-10"
//                 >
//                     <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide bg-[rgba(28,117,188,0.08)] rounded-[12px] p-1 gap-2 md:gap-5 flex justify-start md:justify-center flex-nowrap md:flex-wrap backdrop-blur-sm">
//                         {tabOptions.map((tab, index) => {
//                             const isSignature = tab.startsWith('EH Signature');
//                             return (
//                                 <button
//                                     key={tab}
//                                     onClick={() => setActiveTabIndex(index)}
//                                     className={`px-4 py-2 md:px-6 md:py-2 mx-1 rounded-full text-sm md:text-base font-medium transition-all duration-300 flex-shrink-0 md:flex-grow-0 ${activeTabIndex === index ? 'text-[#E7000B] bg-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'
//                                         }`}
//                                     style={isSignature ? { fontFamily: "'Exo 2', sans-serif" } : {}}
//                                 >
//                                     {isSignature ? (
//                                         <>
//                                             {tab.replace('™', '')}
//                                             <span
//                                                 style={{
//                                                     fontFamily: 'Helvetica, Arial, sans-serif',
//                                                     fontSize: '0.75em',
//                                                     verticalAlign: 'super',
//                                                     marginLeft: '2px',
//                                                 }}
//                                             >
//                                                 ™
//                                             </span>
//                                         </>
//                                     ) : (
//                                         tab
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </Motion.div>

//                 {/* Carousel */}
//                 <Motion.div
//                     variants={fadeInVariants}
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true }}
//                 >
//                     {filteredListings.length === 0 ? (
//                         <p className="text-center text-gray-500">No listings available.</p>
//                     ) : (
//                         <Swiper
//                             ref={swiperRef}
//                             key={activeTabIndex}
//                             modules={[Navigation]}
//                             spaceBetween={20}
//                             slidesPerView={1}
//                             breakpoints={{
//                                 768: { slidesPerView: 2 },
//                                 1024: { slidesPerView: 3 },
//                             }}
//                             onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
//                             className="mySwiper listings-swiper pb-8 px-1 sm:px-4"
//                         >
//                             {filteredListings.map((listing, index) => {
//                             const isImageTop = index % 2 === 0;
//                             return (
//                                 <SwiperSlide key={`${listing.id}-${index}`}>
//                                     <div className="flex justify-center px-2 m-1">
//                                         <Motion.div
//                                             initial={{ opacity: 0, y: 50 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ duration: 0.6, ease: 'easeOut' }}
//                                             className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col justify-between w-[90%] md:w-full h-[430px] border border-gray-200"
//                                         >
//                                             {isImageTop && (
//                                                 <div className="relative w-full h-62 overflow-hidden px-8">
//                                                     <img
//                                                         src={listing.image}
//                                                         alt={listing.title}
//                                                         className="w-full h-full object-cover scale-[1.5] transition-transform duration-500"
//                                                     />
//                                                     <button
//                                                         className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-[12px] shadow"
//                                                         style={{ fontFamily: "'Exo 2', sans-serif" }}
//                                                     >
//                                                         {listing.badge.replace('™', '')}
//                                                         {listing.badge.includes('™') && (
//                                                             <span
//                                                                 style={{
//                                                                     fontFamily: 'Helvetica, Arial, sans-serif',
//                                                                     fontSize: '0.75em',
//                                                                     verticalAlign: 'super',
//                                                                     marginLeft: '2px',
//                                                                 }}
//                                                             >
//                                                                 ™
//                                                             </span>
//                                                         )}
//                                                     </button>
//                                                 </div>
//                                             )}
//                                             <div className="p-3 flex flex-col justify-between flex-grow">
//                                                 <div>
//                                                     <h3 className="font-medium text-2xl text-gray-900 mb-1">{listing.title}</h3>
//                                                     <p className="text-sm text-gray-600 mb-1">{listing.location}</p>
//                                                     <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
//                                                         <span>{listing.area}</span>
//                                                         <span>{listing.bhk}</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex justify-between items-center">
//                                                     <span className="font-bold text-[30px] text-black">{listing.price}</span>
//                                                     <button className="bg-red-600 text-white text-[12px] font-semibold px-3 py-1 rounded-full shadow hover:bg-red-700 transition duration-300">
//                                                         View Details
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             {!isImageTop && (
//                                                 <div className="relative w-full h-62 overflow-hidden">
//                                                     <img
//                                                         src={listing.image}
//                                                         alt={listing.title}
//                                                         className="w-full h-full object-cover scale-[1.5] transition-transform duration-500"
//                                                     />
//                                                     <button
//                                                         className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-[12px] shadow -translate-y-2"
//                                                         style={{ fontFamily: "'Exo 2', sans-serif" }}
//                                                     >
//                                                         {listing.badge.replace('™', '')}
//                                                         {listing.badge.includes('™') && (
//                                                             <span
//                                                                 style={{
//                                                                     fontFamily: 'Helvetica, Arial, sans-serif',
//                                                                     fontSize: '0.75em',
//                                                                     verticalAlign: 'super',
//                                                                     marginLeft: '2px',
//                                                                 }}
//                                                             >
//                                                                 ™
//                                                             </span>
//                                                         )}
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </Motion.div>
//                                     </div>
//                                 </SwiperSlide>
//                             );
//                         })}
//                         </Swiper>
//                     )}

//                     {/* Navigation Arrows */}
//                     <div className="flex justify-center gap-6 mt-6 md:hidden">
//                         <button onClick={handlePrev} className="bg-gray-800 text-white p-3 rounded-full shadow hover:bg-red-600 transition">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                             </svg>
//                         </button>
//                         <button onClick={handleNext} className="bg-gray-800 text-white p-3 rounded-full shadow hover:bg-red-600 transition">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                             </svg>
//                         </button>
//                     </div>

//                     {/* Desktop arrows */}
//                     <div className="hidden md:flex">
//                         <div onClick={handlePrev} className="swiper-button-prev-listings absolute left-[-60px] top-1/2 -translate-y-1/2 z-30 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition cursor-pointer">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                             </svg>
//                         </div>
//                         <div onClick={handleNext} className="swiper-button-next-listings absolute right-[-60px] top-1/2 -translate-y-1/2 z-30 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition cursor-pointer">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                             </svg>
//                         </div>
//                     </div>
//                 </Motion.div>
//             </div>
//         </section>
//     );
// };

// export default PropertyListing;



// src/components/PropertyListing.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import propertiesData from "../data/properties";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";

// const TABS = ["For Sale", "For Rent", "Luxury Rentals", "EH Signature™"];

// /* Slides per view helper so arrow-logic matches Swiper breakpoints */
// const getPerView = () => {
//   if (typeof window === "undefined") return 3;
//   const w = window.innerWidth;
//   if (w >= 1024) return 3; // desktop
//   if (w >= 768) return 2;  // tablet
//   return 1;                // mobile
// };

// /* Normalize possibly different property field names */
// const normalize = (p) => ({
//   id: p.id ?? `${(p.title || p.name || "prop")}-${Math.random().toString(36).slice(2, 7)}`,
//   title: p.title || p.name || "Property",
//   image: p.image || p.img || "/images/properties/placeholder.jpg",
//   location: p.location || "",
//   type: p.type || p.bhk || "",
//   area: p.area || p.sqft || p.size || "",
//   price: p.price || "",
//   category: p.category || "",
// });

// export default function PropertyListing({ listings }) {
//   const data = (Array.isArray(listings) && listings.length ? listings : propertiesData).map(normalize);

//   const [activeTab, setActiveTab] = useState(0);
//   const [perView, setPerView] = useState(getPerView());
//   const [pageIndex, setPageIndex] = useState(0);

//   const swiperRef = useRef(null);

//   useEffect(() => {
//     const onResize = () => setPerView(getPerView());
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   // Filter by tab
//   const items = useMemo(
//     () => data.filter((p) => p.category === TABS[activeTab]),
//     [data, activeTab]
//   );

//   const totalPages = Math.max(1, Math.ceil(items.length / perView));

//   useEffect(() => {
//     setPageIndex(0);
//     const s = swiperRef.current?.swiper;
//     if (s) s.slideTo(0, 0);
//   }, [activeTab, perView]);

//   const goPrev = () => {
//     if (pageIndex > 0) {
//       swiperRef.current?.swiper.slidePrev();
//       return;
//     }
//     // jump to previous tab (last page)
//     const prevTab = (activeTab - 1 + TABS.length) % TABS.length;
//     setActiveTab(prevTab);
//     setTimeout(() => {
//       const nextItems = data.filter((p) => p.category === TABS[prevTab]);
//       const pv = getPerView();
//       const pagesPrev = Math.max(1, Math.ceil(nextItems.length / pv));
//       setPageIndex(pagesPrev - 1);
//       requestAnimationFrame(() => {
//         const s = swiperRef.current?.swiper;
//         if (s) s.slideTo(Math.max(0, (pagesPrev - 1) * pv), 0);
//       });
//     }, 0);
//   };

//   const goNext = () => {
//     if (pageIndex < totalPages - 1) {
//       swiperRef.current?.swiper.slideNext();
//       return;
//     }
//     // jump to next tab (first page)
//     const nextTab = (activeTab + 1) % TABS.length;
//     setActiveTab(nextTab);
//     setTimeout(() => {
//       setPageIndex(0);
//       requestAnimationFrame(() => {
//         const s = swiperRef.current?.swiper;
//         if (s) s.slideTo(0, 0);
//       });
//     }, 0);
//   };

//   return (
//     <section className="relative bg-white pt-16 pb-10 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Tabs */}
//         <div className="mb-8 flex justify-center">
//           <div className="w-full max-w-4xl rounded-xl bg-[#1C75BC14] p-1 flex gap-2 overflow-x-auto md:justify-center">
//             {TABS.map((t, i) => (
//               <button
//                 key={t}
//                 onClick={() => setActiveTab(i)}
//                 className={[
//                   "px-4 py-2 md:px-6 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition",
//                   activeTab === i ? "bg-white text-[#E7000B] shadow" : "text-gray-700 hover:bg-gray-200",
//                 ].join(" ")}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Carousel */}
//         {items.length === 0 ? (
//           <p className="text-center text-gray-500">No listings in this category.</p>
//         ) : (
//           <div className="relative">
//             {/* Desktop arrows */}
//             <button
//               onClick={goPrev}
//               aria-label="Previous"
//               className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <button
//               onClick={goNext}
//               aria-label="Next"
//               className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//               </svg>
//             </button>

//             <Swiper
//               ref={swiperRef}
//               modules={[Navigation]}
//               slidesPerView={perView}
//               slidesPerGroup={perView}
//               spaceBetween={20}
//               onSlideChange={(s) => setPageIndex(Math.floor(s.activeIndex / perView))}
//               className="pb-2"
//             >
//               {items.map((it, idx) => (
//                 <SwiperSlide key={`${it.id}-${idx}`}>
//                   <AlternatingCard item={it} index={idx} />
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Mobile arrows */}
//             <div className="md:hidden mt-6 flex justify-center gap-6">
//               <button onClick={goPrev} className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <button onClick={goNext} className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// /* ---------------- CARD (Alternating) ---------------- */

// function AlternatingCard({ item, index }) {
//   const { title, image, location, type, area, price } = item;
//   const imgFirst = index % 2 === 0; // even -> image on top, odd -> image on bottom

//   const ImageBlock = (
//     <div className="relative w-full h-[240px] md:h-[250px] lg:h-[260px] bg-gray-100">
//       <img
//         src={image}
//         alt={title}
//         className="absolute inset-0 h-full w-full object-cover"
//         loading="lazy"
//       />
//     </div>
//   );

//   const TextBlock = (
//     <div className="flex flex-col gap-2 p-4 lg:p-5">
//       <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">{title}</h3>
//       <div className="text-sm text-gray-600">{location}</div>

//       <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-500">
//         <span className="truncate">{area}</span>
//         <span className="text-right">{type}</span>
//       </div>

//       <div className="mt-3 flex items-center justify-between">
//         <div className="text-2xl font-bold text-gray-900">{price}</div>
//         <button className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-red-700">
//           View Details
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="h-full w-full">
//       <div className="flex h-full min-h-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
//         {imgFirst ? (
//           <>
//             {ImageBlock}
//             {TextBlock}
//           </>
//         ) : (
//           <>
//             {TextBlock}
//             {ImageBlock}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useMemo, useRef, useState } from "react";
import rawProperties from "../data/properties"; // keep path as-is if that's where your file is
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const TABS = ["For Sale", "For Rent", "Luxury Rentals", "EH Signature™"];
const DEBUG = true;

/* helper: derive title from image filename if no explicit title */
const deriveTitleFromImage = (img) => {
  if (!img) return "";
  try {
    // handle URLs like /images/properties/konig-villas-1.jpg or full url
    const parts = img.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    const name = last.split(".")[0] || last;
    if (!name) return "";
    // replace dashes/underscores, capitalize words
    return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return "";
  }
};

/* Normalizer: robustly pick a title and other fields */
const normalizeRaw = (p = {}) => {
  const rawTitle = (p.title || "").toString().trim();
  const firstImage = Array.isArray(p.images) && p.images.length ? p.images[0] : undefined;
  const derived = deriveTitleFromImage(p.image ?? p.img ?? p.src ?? firstImage);
  const title =
    rawTitle.length > 0 ? rawTitle : derived || `Property ${p.id ?? ""}` || "Untitled Property";
  const image =
    p.image || p.img || p.src || firstImage || "/images/properties/Konig Villas North County.jpg";
  const location = (p.location || p.city || p.area || p.town || "") + "";
  const type = (p.type || p.bhk || p.propertyType || "") + "";
  const area = (p.area || p.sqft || p.size || "") + "";
  const price = (p.price || p.rate || "") + "";
  const rawCategory = (p.category || p.tag || p.listingType || "").toString().trim();
  const categoryNormalized = rawCategory.toLowerCase();
  return { id: p.id ?? `${title}-${Math.random().toString(36).slice(2, 7)}`, title, image, location, type, area, price, category: rawCategory, categoryNormalized, raw: p };
};

/* Determine the source array even if properties file used a named export or wrapped object */
const getSourceArray = (maybe) => {
  if (Array.isArray(maybe)) return maybe;
  if (!maybe) return [];
  if (Array.isArray(maybe.properties)) return maybe.properties;
  if (Array.isArray(maybe.default)) return maybe.default;
  // if it's an object of many keys, try to find the first array value
  const arr = Object.values(maybe).find((v) => Array.isArray(v));
  return Array.isArray(arr) ? arr : [];
};

/* Slides per view helper so arrow-logic matches breakpoints */
const getPerView = () => {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 768) return 2;
  return 1;
};

export default function PropertyListing({ listings }) {
  const rawSource = Array.isArray(listings) && listings.length ? listings : rawProperties;
  const srcArray = getSourceArray(rawSource);
  const data = srcArray.map(normalizeRaw);

  const [activeTab, setActiveTab] = useState(0);
  const [perView, setPerView] = useState(getPerView());
  const [pageIndex, setPageIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (DEBUG) {
      console.log("PropertyListing: source array length:", srcArray.length);
      console.log("PropertyListing: normalized sample (first 8):");
      console.table(data.slice(0, 8).map((d) => ({ id: d.id, title: d.title, category: d.category })));
    }
  }, []); // run once

  // tolerant tab-matching: compare lowercased strings
  const items = useMemo(() => {
    const want = TABS[activeTab].toLowerCase();
    return data.filter((p) => p.categoryNormalized === want);
  }, [data, activeTab]);

  const totalPages = Math.max(1, Math.ceil(items.length / perView));

  useEffect(() => {
    setPageIndex(0);
    const s = swiperRef.current?.swiper;
    if (s) s.slideTo(0, 0);
  }, [activeTab, perView]);

  const goPrev = () => {
    if (pageIndex > 0) {
      swiperRef.current?.swiper.slidePrev();
      return;
    }
    const prevTab = (activeTab - 1 + TABS.length) % TABS.length;
    setActiveTab(prevTab);
    setTimeout(() => {
      const nextItems = data.filter((p) => p.categoryNormalized === TABS[prevTab].toLowerCase());
      const pv = getPerView();
      const pagesPrev = Math.max(1, Math.ceil(nextItems.length / pv));
      setPageIndex(pagesPrev - 1);
      requestAnimationFrame(() => {
        const s = swiperRef.current?.swiper;
        if (s) s.slideTo(Math.max(0, (pagesPrev - 1) * pv), 0);
      });
    }, 0);
  };

  const goNext = () => {
    if (pageIndex < totalPages - 1) {
      swiperRef.current?.swiper.slideNext();
      return;
    }
    const nextTab = (activeTab + 1) % TABS.length;
    setActiveTab(nextTab);
    setTimeout(() => {
      setPageIndex(0);
      requestAnimationFrame(() => {
        const s = swiperRef.current?.swiper;
        if (s) s.slideTo(0, 0);
      });
    }, 0);
  };

  return (
    <section className="relative bg-white pt-16 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-4xl rounded-xl bg-[#1C75BC14] p-1 flex gap-2 overflow-x-auto md:justify-center">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={[
                  "px-4 py-2 md:px-6 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition",
                  activeTab === i ? "bg-white text-[#E7000B] shadow" : "text-gray-700 hover:bg-gray-200",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        {items.length === 0 ? (
          <p className="text-center text-gray-500">
            No listings in this category. (Try checking the `category` fields in your properties file.)
          </p>
        ) : (
          <div className="relative">
            {/* Desktop arrows */}
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              aria-label="Next"
              className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              slidesPerView={perView}
              slidesPerGroup={perView}
              spaceBetween={20}
              onSlideChange={(s) => setPageIndex(Math.floor(s.activeIndex / perView))}
              className="pb-2"
            >
              {items.map((it, idx) => (
                <SwiperSlide key={`${it.id}-${idx}`}>
                  <AlternatingCard item={it} index={idx} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Mobile arrows */}
            <div className="md:hidden mt-6 flex justify-center gap-6">
              <button onClick={goPrev} className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={goNext} className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- CARD (Alternating) ---------------- */

function AlternatingCard({ item, index }) {
  const { title, image, location, type, area, price } = item;
  const imgFirst = index % 2 === 0; // even -> image on top, odd -> image on bottom

  const ImageBlock = (
    <div className="relative w-full h-[240px] md:h-[250px] lg:h-[260px] bg-gray-100">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );

  const TextBlock = (
    <div className="flex flex-col gap-2 p-4 lg:p-5">
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">{title}</h3>
      <div className="text-sm text-gray-600">{location}</div>

      <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-500">
        <span className="truncate">{area}</span>
        <span className="text-right">{type}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">{price}</div>
        <button className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-red-700">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      <div className="flex h-full min-h-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
        {imgFirst ? (
          <>
            {ImageBlock}
            {TextBlock}
          </>
        ) : (
          <>
            {TextBlock}
            {ImageBlock}
          </>
        )}
      </div>
    </div>
  );
}
