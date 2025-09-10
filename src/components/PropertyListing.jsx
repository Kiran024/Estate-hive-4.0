// import React, { useEffect, useMemo, useRef, useState } from "react";
// import propertiesDefault from "../data/properties"; // default export should be the array
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";

// const TABS = ["For Sale", "For Rent", "Luxury Rentals", "EH Signature™"];
// const DEBUG = false;
// const PLACEHOLDER = "/images/properties/placeholder.jpg";

// /** Title helper (fallback to filename if needed) */
// const deriveTitleFromImage = (img) => {
//   if (!img || typeof img !== "string") return "";
//   try {
//     const parts = img.split("/").filter(Boolean);
//     const last = parts[parts.length - 1] || "";
//     const name = last.split(".")[0] || last;
//     if (!name) return "";
//     return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
//   } catch {
//     return "";
//   }
// };

// /** STRICT: only accept an array or an object with a clear array field */
// const getSourceArrayStrict = (maybe) => {
//   if (Array.isArray(maybe)) return maybe;
//   if (!maybe || typeof maybe !== "object") return [];

//   // Allow common shapes, but do NOT "guess" any other array (like images[])
//   if (Array.isArray(maybe.properties)) return maybe.properties;
//   if (Array.isArray(maybe.default)) return maybe.default;

//   return [];
// };

// /** Normalize one property object */
// const normalize = (p = {}) => {
//   const firstImage =
//     Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : undefined;

//   const titleRaw = (p.title || "").toString().trim();
//   const title =
//     titleRaw || deriveTitleFromImage(firstImage) || `Property ${p.id ?? ""}`.trim();

//   return {
//     id: p.id ?? Math.random().toString(36).slice(2),
//     title,
//     image: firstImage || p.image || p.img || p.src || PLACEHOLDER,
//     location: p.location || p.city || p.area || p.town || "",
//     type: p.type || (p.bhk ? `${p.bhk} BHK` : "") || p.propertyType || "",
//     area: p.area || p.sqft || p.size || "",
//     price: p.price || p.rate || "",
//     category: p.category || p.tag || p.listingType || "For Sale",
//     categoryNormalized: (p.category || p.tag || p.listingType || "For Sale")
//       .toString()
//       .trim()
//       .toLowerCase(),
//     raw: p,
//   };
// };

// /** Slides per view helper so arrow-logic matches breakpoints */
// const getPerView = () => {
//   if (typeof window === "undefined") return 3;
//   const w = window.innerWidth;
//   if (w >= 1024) return 3;
//   if (w >= 768) return 2;
//   return 1;
// };

// export default function PropertyListing({ listings }) {
//   // Use provided listings if valid, otherwise fall back to imported default (or [])
//   const source =
//     (Array.isArray(listings) && listings.length ? listings : propertiesDefault) || [];
//   const srcArray = getSourceArrayStrict(source);
//   const data = useMemo(() => srcArray.map(normalize), [srcArray]);

//   const [activeTab, setActiveTab] = useState(0);
//   const [perView, setPerView] = useState(getPerView());
//   const [pageIndex, setPageIndex] = useState(0);
//   const swiperRef = useRef(null);

//   useEffect(() => {
//     const onResize = () => setPerView(getPerView());
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   useEffect(() => {
//     if (DEBUG) {
//       console.log("PropertyListing: total items:", data.length);
//       console.table(
//         data.slice(0, 6).map((d) => ({
//           id: d.id,
//           title: d.title,
//           image: d.image,
//           category: d.category,
//         }))
//       );
//     }
//   }, [data]);

//   // Filter by tab/category
//   const items = useMemo(() => {
//     const want = TABS[activeTab].toLowerCase();
//     return data.filter((p) => p.categoryNormalized === want);
//   }, [data, activeTab]);

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
//     const prevTab = (activeTab - 1 + TABS.length) % TABS.length;
//     setActiveTab(prevTab);
//     setTimeout(() => {
//       const nextItems = data.filter(
//         (p) => p.categoryNormalized === TABS[prevTab].toLowerCase()
//       );
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
//                   activeTab === i
//                     ? "bg-white text-[#E7000B] shadow"
//                     : "text-gray-700 hover:bg-gray-200",
//                 ].join(" ")}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Carousel */}
//         {items.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No listings in this category.
//           </p>
//         ) : (
//           <div className="relative">
//             {/* Desktop arrows */}
//             <button
//               onClick={goPrev}
//               aria-label="Previous"
//               className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <button
//               onClick={goNext}
//               aria-label="Next"
//               className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
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
//                   <Card item={it} index={idx} />
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Mobile arrows */}
//             <div className="md:hidden mt-6 flex justify-center gap-6">
//               <button
//                 onClick={goPrev}
//                 className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="mx-auto h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <button
//                 onClick={goNext}
//                 className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="mx-auto h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
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

// /* ---------------- CARD ---------------- */

// function Card({ item, index }) {
//   const { title, image, location, type, area, price } = item;
//   const imgFirst = index % 2 === 0; // even -> image on top, odd -> image on bottom

//   const ImageBlock = (
//     <div className="relative w-full h-[240px] md:h-[250px] lg:h-[260px] bg-gray-100">
//       <img
//         src={image || PLACEHOLDER}
//         alt={title}
//         className="absolute inset-0 h-full w-full object-cover"
//         loading="lazy"
//       />
//     </div>
//   );

//   const TextBlock = (
//     <div className="flex flex-col gap-2 p-4 lg:p-5">
//       <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">
//         {title}
//       </h3>
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



// // src/components/PropertyListing.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import propertiesDefault from "../data/properties"; // your file
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, A11y } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const TABS = ["For Sale", "For Rent", "Luxury Rentals", "EH Signature™"];
// const PLACEHOLDER1 = "/images/properties/Konig Villas North County.jpg";
// const PLACEHOLDER2 = "/images/properties/Barca At Godrej MSR City.jpg";

// /** Title helper (fallback to filename if needed) */

// /** Derive a neat title from a URL (fallback helper) */
// const deriveTitleFromImage = (img) => {
//   if (!img || typeof img !== "string") return "";
//   try {
//     const parts = img.split("/").filter(Boolean);
//     const last = parts[parts.length - 1] || "";
//     const name = last.split(".")[0] || last;
//     if (!name) return "";
//     return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
//   } catch {
//     return "";
//   }
// };

// /** Normalize one property */
// const normalize = (p = {}) => {
//   const images =
//     Array.isArray(p.images) && p.images.length
//       ? p.images.filter(Boolean)
//       : [p.image || p.img || p.src || PLACEHOLDER1 || PLACEHOLDER2];

//   const firstImage = images[0];
//   const titleRaw = (p.title || "").toString().trim();
//   const title =
//     titleRaw || deriveTitleFromImage(firstImage) || `Property ${p.id ?? ""}`.trim();

//   const category = (p.category || "For Sale").toString().trim();

//   return {
//     id: p.id ?? Math.random().toString(36).slice(2),
//     title,
//     images,
//     image: firstImage || PLACEHOLDER1  || PLACEHOLDER2,   // cover if you need it elsewhere
//     location: p.location || "",
//     type: p.type || (p.bhk ? `${p.bhk} BHK` : "") || "",
//     area: p.area || p.sqft || p.size || "",
//     price: p.price || "",
//     category,
//     categoryNormalized: category.toLowerCase(),
//     raw: p,
//   };
// };

// /** Slides per view helper so arrows match breakpoints */
// const getPerView = () => {
//   if (typeof window === "undefined") return 3;
//   const w = window.innerWidth;
//   if (w >= 1024) return 3;
//   if (w >= 768) return 2;
//   return 1;
// };

// export default function PropertyListing({ listings }) {
//   const source =
//     (Array.isArray(listings) && listings.length ? listings : propertiesDefault) ||
//     [];
//   const data = useMemo(() => source.map(normalize), [source]);

//   const [activeTab, setActiveTab] = useState(0);
//   const [perView, setPerView] = useState(getPerView());
//   const [pageIndex, setPageIndex] = useState(0);
//   const swiperRef = useRef(null);

//   useEffect(() => {
//     const onResize = () => setPerView(getPerView());
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   // Filter by tab/category
//   const items = useMemo(() => {
//     const want = TABS[activeTab].toLowerCase();
//     return data.filter((p) => p.categoryNormalized === want);
//   }, [data, activeTab]);

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
//     const prevTab = (activeTab - 1 + TABS.length) % TABS.length;
//     setActiveTab(prevTab);
//     setTimeout(() => {
//       const nextItems = data.filter(
//         (p) => p.categoryNormalized === TABS[prevTab].toLowerCase()
//       );
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
//                   activeTab === i
//                     ? "bg-white text-[#E7000B] shadow"
//                     : "text-gray-700 hover:bg-gray-200",
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
//                   <Card item={it} index={idx} />
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Mobile arrows */}
//             <div className="md:hidden mt-6 flex justify-center gap-6">
//               <button
//                 onClick={goPrev}
//                 className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <button
//                 onClick={goNext}
//                 className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
//               >
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

// /* ---------------- CARD ---------------- */

// function Card({ item, index }) {
//   const navigate = useNavigate();
//   const { id, title, images, location, type, area, price } = item;
//   const imgFirst = index % 2 === 0; // even -> image on top, odd -> image on bottom

//   const Gallery = (
//     <div className="relative w-full h-[240px] md:h-[250px] lg:h-[260px] bg-gray-100">
//       <Swiper
//         modules={[Pagination, A11y]}
//         slidesPerView={1}
//         pagination={{ clickable: true }}
//         className="absolute inset-0 overflow-hidden"
//       >
//         {images.map((src, i) => (
//           <SwiperSlide key={`${id}-img-${i}`}>





            
//             <img
//               src={src || PLACEHOLDER1 || PLACEHOLDER2}
//               alt={`${title} – ${i + 1}`}
//               className="h-full w-full object-cover"
//               loading="lazy"
//               onError={(e) => {
//                 e.currentTarget.src = PLACEHOLDER1  // fallback if image fails to load
//               }}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//       <div className="absolute right-2 bottom-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
//         {images.length} photos
//       </div>
//     </div>
//   );

//   const TextBlock = (
//     <div className="flex flex-col gap-2 p-4 lg:p-5">
//       <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">
//         {title}
//       </h3>
//       <div className="text-sm text-gray-600">{location}</div>

//       <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-500">
//         <span className="truncate">{area}</span>
//         <span className="text-right">{type}</span>
//       </div>

//       <div className="mt-3 flex items-center justify-between">
//         <div className="text-2xl font-bold text-gray-900">{price}</div>
//         <button
//           onClick={() => {
//             // route to your AllProperties / Mapbox view
//             // change this path if your route is different
//             navigate(`/properties/${id}`);
//           }}
//           className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-red-700"
//         >
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
//             {Gallery}
//             {TextBlock}
//           </>
//         ) : (
//           <>
//             {TextBlock}
//             {Gallery}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/PropertyListing.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom"; // <--- 1. IMPORT LINK
import { useAuth } from "../contexts/AuthContext";
import properties from "../data/properties";
import { propertyService } from "../services/propertyService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import WishlistButton from "./common/WishlistButton";
import "swiper/css";
import "swiper/css/navigation";

const TABS = [
  "For Sale", 
  "EH Dubai",
  "For Rent", 
  "Luxury Rentals",
  "EH Commercial",
  "EH Verified",
  "EH Signature™",
 
];
const PLACEHOLDER = "/images/properties/placeholder.jpg";

// Format INR in short units with rupee symbol (Cr/L)
const formatINRShort = (value) => {
  const rupee = '\u20B9';
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const hasUnit = /\b(cr|crore|l|lac|lakh|k|thousand)\b/i.test(trimmed);
    const hasRupee = trimmed.includes(rupee);
    if (hasUnit) {
      const cleaned = trimmed
        .replace(/crore/i, 'Cr')
        .replace(/lakh|lac/i, 'L')
        .replace(/thousand/i, 'K')
        .replace(/\s+/g, ' ');
      return hasRupee ? cleaned : `${rupee}${cleaned}`;
    }
    const numeric = Number(trimmed.replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(numeric) && numeric > 0) return formatINRShort(numeric);
    return trimmed;
  }
  const n = Number(value);
  if (Number.isNaN(n)) return '';
  if (n >= 10000000) return `${rupee}${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `${rupee}${(n / 100000).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
};

// Format monthly rent in short units with rupee symbol (K/L/Cr)
// Note: Many rent values in the data are stored as thousands (e.g., 85 => 85K).
// To reflect this, values < 1000 are interpreted as thousands.
const formatRentShort = (value) => {
  const rupee = '\u20B9';
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'string') {
    // Strip any existing "/month" or "per month" suffix to avoid double appending
    const base = value.replace(/\s*(?:\/|per\s*)month\b/gi, '').trim();
    // If already contains unit, normalize and ensure rupee prefix
    if (/\b(cr|crore|l|lac|lakh|k|thousand)\b/i.test(base) || /[kK]\b/.test(base)) {
      const cleaned = base
        .replace(/crore/i, 'Cr')
        .replace(/lakh|lac/i, 'L')
        .replace(/thousand/i, 'K')
        .replace(/\s+/g, ' ');
      return cleaned.includes(rupee) ? cleaned : `${rupee}${cleaned}`;
    }
    // Try to parse numeric from string
    const numeric = Number(base.replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(numeric) && numeric > 0) return formatRentShort(numeric);
    return base;
  }
  const n = Number(value);
  if (Number.isNaN(n) || n <= 0) return '';
  if (n >= 10000000) return `\u20B9${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `\u20B9${(n / 100000).toFixed(1)} L`;
  // Treat values under 1000 as thousands (e.g., 85 => 85K)
  if (n >= 1000) return `\u20B9${Math.round(n / 1000)}K`;
  return `\u20B9${Math.round(n)}K`;
};

// Curated initial 6 for unauthorized users under "For Sale"
const CURATED_FOR_SALE_TITLES = [
  "Brigade Eternia",
  "L&T Elara Celestia",
  "Barca At Godrej MSR City",
  "Surya Valencia",
  "Elegant Takt Tropical Symphony",
  "Assetz Sora and Saki",
];

//

/** Title helper (fallback to filename if needed) */
const deriveTitleFromImage = (img) => {
  if (!img || typeof img !== "string") return "";
  try {
    const parts = img.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    const name = last.split(".")[0] || last;
    if (!name) return "";
    return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return "";
  }
};

/** Normalize one property object */
const normalize = (p = {}) => {
  const firstImage =
    Array.isArray(p.image) && p.image.length > 0 ? p.image[0] : undefined;

  const titleRaw = (p.title || "").toString().trim();
  const title =
    titleRaw || deriveTitleFromImage(firstImage) || `Property ${p.id ?? ""}`.trim();

  // Determine display category based on subcategory first, then regular category
  let displayCategory = p.category || p.tag || p.listingType || "For Sale";
  
  // Check subcategory for EH categories
  if (p.subcategory === 'eh_commercial') {
    displayCategory = 'EH Commercial';
  } else if (p.subcategory === 'eh_verified') {
    displayCategory = 'EH Verified';
  } else if (p.subcategory === 'eh_signature') {
    displayCategory = 'EH Signature™';
  } else if (p.subcategory === 'eh_dubai') {
    displayCategory = 'EH Dubai';
  } else if (p.category === 'lease') {
    displayCategory = 'Luxury Rentals';
  } else if (p.category === 'sale') {
    displayCategory = 'For Sale';
  } else if (p.category === 'rent') {
    displayCategory = 'For Rent';
  } else if (p.category === 'rent_to_own') {
    displayCategory = 'EH Signature™'; // Fallback for old data
  }

  return {
    id: p.id ?? Math.random().toString(36).slice(2),
    title,
    image: firstImage || p.image || p.img || p.src || PLACEHOLDER,
    location: p.location || p.city || p.area || p.town || "",
    // Prefer explicit BHK for type label
    type: (() => {
      const bedrooms = p?.bhk ?? p?.bedrooms;
      if (bedrooms !== undefined && bedrooms !== null && `${bedrooms}`.trim() !== '') {
        return `${String(bedrooms).trim()}BHK`;
      }
      return p.type || p.propertyType || '';
    })(),
    // Area string normalized and suffixed with sqft (no space) if numeric
    area: (() => {
      const rawArea = p.area || p.area_sqft || p.built_up_area || p.carpet_area || p.plot_area || p.size || p.sqft;
      if (rawArea === undefined || rawArea === null || rawArea === '') return '';
      const s = `${rawArea}`;
      return /sq/i.test(s) ? s : `${s}sqft`;
    })(),
    price: p.price || p.rate || "",
    category: displayCategory,
    categoryNormalized: displayCategory.toString().trim().toLowerCase(),
    subcategory: p.subcategory,
    property_type: p.property_type,
    raw: p,
  };
};

// Prefer higher resolution image URLs for signed-in users where possible
const deriveHighRes = (url) => {
  if (!url || typeof url !== 'string') return url;
  try {
    let out = url;
    // Common pattern from sample data like h02@300x-100.jpg => h02@1080x-100.jpg
    out = out.replace(/@300x-\d+/g, '@1080x-100');
    out = out.replace(/@300x/g, '@1080x');
    return out;
  } catch {
    return url;
  }
};

// Choose the best available image for logged-in users
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
    return deriveHighRes(fallback);
  }
};

// Build a responsive srcSet from a base URL following the @{width}x- pattern
const buildSrcSetFromUrl = (url) => {
  if (!url || typeof url !== 'string') return undefined;
  // Only handle the @{width}x-{q} style; otherwise return undefined
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

/** Slides per view helper so arrow-logic matches breakpoints */
const getPerView = () => {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 768) return 2;
  return 1;
};

export default function PropertyListing({ listings, onPropertyClick, showLoginPrompt }) {
  const { user } = useAuth();
  const isGuest = !user; // Logged-in users are never gated
  const sourceData = (Array.isArray(listings) && listings.length > 0) ? listings : properties;
  const data = useMemo(() => sourceData.map(normalize), [sourceData]);
  // Full local catalog for curated fallback (ensures 6 items even if listings are sparse)
  const fullData = useMemo(() => properties.map(normalize), []);

  const [activeTab, setActiveTab] = useState(0);
  // Force 3-per-view for guests; responsive for signed-in users
  const initialPerView = (isGuest ? 3 : getPerView());
  const [perView, setPerView] = useState(initialPerView);
  const [pageIndex, setPageIndex] = useState(0);
  const [showGate, setShowGate] = useState(false);
  const [showDubaiGate, setShowDubaiGate] = useState(false);
  const swiperRef = useRef(null);
  // Live price map keyed by lowercased title -> { display: string, isMonthly: boolean }
  const [livePriceMap, setLivePriceMap] = useState(new Map());

  // Fetch live For Sale properties for signed-in users so details route IDs match
  const [liveSale, setLiveSale] = useState([]);
  const [liveSaleLoaded, setLiveSaleLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const fetchLive = async () => {
      if (!user) {
        setLiveSale([]);
        setLiveSaleLoaded(false);
        return;
      }
      try {
        const { data: rows, error } = await propertyService.getAllProperties({
          status: 'active',
          category: 'sale',
          sortBy: 'created_at',
          sortOrder: 'desc',
          pageSize: 48,
        });
        if (cancelled) return;
        if (error) {
          setLiveSale([]);
          setLiveSaleLoaded(true);
          return;
        }
        const mapped = Array.isArray(rows) ? rows.map(normalize) : [];
        setLiveSale(mapped);
        setLiveSaleLoaded(true);
      } catch {
        if (!cancelled) {
          setLiveSale([]);
          setLiveSaleLoaded(true);
        }
      }
    };
    fetchLive();
    return () => { cancelled = true; };
  }, [user]);

  // Fetch live prices for all recent properties to replace "Price on Request"
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const { data: rows, error } = await propertyService.getAllProperties({
          status: 'active',
          sortBy: 'created_at',
          sortOrder: 'desc',
          pageSize: 120,
        });
        if (cancelled) return;
        if (error) return;
        const map = new Map();
        (rows || []).forEach((p) => {
          const key = (p?.title || '').toString().trim().toLowerCase();
          if (!key) return;
          const cat = (p?.category || '').toString().toLowerCase();
          const hasRent = p?.rent_amount !== null && p?.rent_amount !== undefined;
          const isMonthly = hasRent || cat === 'rent' || cat === 'lease';
          const rawAmount = hasRent ? (p?.rent_amount ?? p?.price) : (p?.price ?? p?.rent_amount);
          const display = isMonthly ? formatRentShort(rawAmount) : formatINRShort(rawAmount);
          if (display) {
            map.set(key, { display, isMonthly });
          }
        });
        setLivePriceMap(map);
      } catch {
        // swallow
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onResize = () => setPerView(isGuest ? 3 : getPerView());
    // Initialize immediately
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isGuest]);

  const items = useMemo(() => {
    const want = TABS[activeTab].toLowerCase();
    // For Sale curated view ONLY for guests (unauthorized)
    if (isGuest && activeTab === 0) {
      const allForSale = fullData.filter((p) => p.categoryNormalized === "for sale");
      const mapByTitle = new Map(allForSale.map((p) => [p.title, p]));
      const curated = CURATED_FOR_SALE_TITLES.map((t) => mapByTitle.get(t)).filter(Boolean);
      if (curated.length >= 6) return curated.slice(0, 6);
      const used = new Set(curated.map((p) => p.id));
      const pad = allForSale.filter((p) => !used.has(p.id));
      return [...curated, ...pad].slice(0, 6);
    }
    // For logged-in users on For Sale tab: use live data with real IDs
    if (!isGuest && want === 'for sale' && (liveSaleLoaded || liveSale.length)) {
      return liveSale;
    }
    return data.filter((p) => p.categoryNormalized === want);
  }, [data, fullData, activeTab, isGuest, liveSale, liveSaleLoaded]);

  // Guest item limit: 3 on mobile (<768px), 6 on desktop (>=768px)
  const computeGuestLimit = () => {
    // For guests on "For Sale": always allow 6 items so it can paginate 3 + 3
    if (isGuest && activeTab === 0) return 6;
    if (typeof window === 'undefined') return 6;
    return window.innerWidth < 768 ? 3 : 6;
  };
  const [guestLimit, setGuestLimit] = useState(computeGuestLimit());

  useEffect(() => {
    const onResizeLimit = () => setGuestLimit(computeGuestLimit());
    onResizeLimit();
    window.addEventListener('resize', onResizeLimit);
    return () => window.removeEventListener('resize', onResizeLimit);
  }, []);

  // For guests on "For Sale": compute responsive per-view (1/2/3) for mobile/tablet/desktop
  const calcGuestPerView = () => {
    if (typeof window === 'undefined') return 3;
    const w = window.innerWidth;
    if (w >= 768) return 3; // tablet/desktop
    return 1;               // all mobile widths show 1 card
  };

  // Limit unauthenticated users by guestLimit
  const displayItems = useMemo(() => {
    if (!user) return items.slice(0, guestLimit);
    return items;
  }, [user, items, guestLimit]);

  const isForSaleGuest = isGuest && activeTab === 0;
  const currentPerView = isForSaleGuest ? calcGuestPerView() : perView;
  const totalPages = Math.max(1, Math.ceil(displayItems.length / currentPerView));

  useEffect(() => {
    setPageIndex(0);
    const s = swiperRef.current?.swiper;
    if (s) s.slideTo(0, 0);
    setShowGate(false);
  }, [activeTab, perView, guestLimit]);

  const goPrev = () => {
    if (pageIndex > 0) {
      swiperRef.current?.swiper.slidePrev();
      return;
    }
    const prevTab = (activeTab - 1 + TABS.length) % TABS.length;
    setActiveTab(prevTab);
  };

  const goNext = () => {
    if (pageIndex < totalPages - 1) {
      swiperRef.current?.swiper.slideNext();
      return;
    }
    // At the last page. For unauthenticated users, show gate instead of switching tab
    if (!user) {
      setShowGate(true);
      return;
    }
    const nextTab = (activeTab + 1) % TABS.length;
    setActiveTab(nextTab);
  };

  // Handle tab clicks with EH tabs gating for guests
  const handleTabClick = (i) => {
    const label = TABS[i];
    const gatedLabels = new Set(["EH Dubai", "Luxury Rentals", "EH Commercial", "EH Verified", "EH Signature�,�"]);
    if (!user && gatedLabels.has(label)) {
      setShowDubaiGate(true);
      return;
    }
    setActiveTab(i);
  };

  return (
    <section className="relative bg-white pt-16 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-6xl rounded-xl bg-[#1C75BC14] p-1 flex flex-wrap gap-1 justify-center">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => handleTabClick(i)}
                className={[
                  "px-3 py-2 md:px-4 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition flex-shrink-0",
                  activeTab === i
                    ? "bg-white text-[#E7000B] shadow"
                    : "text-gray-700 hover:bg-gray-200",
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
          Coming Soon! No listings in this category.
          </p>
        ) : (
          <div className="relative">
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="prev-btn hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              aria-label="Next"
              className="next-btn hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              slidesPerView={isForSaleGuest ? currentPerView : perView}
              slidesPerGroup={isForSaleGuest ? currentPerView : perView}
              spaceBetween={isForSaleGuest ? 12 : 20}
              breakpoints={isForSaleGuest ? {
                0:   { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 10 },
                768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 12 },
              } : {
                0:   { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
                768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
                1024:{ slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
              }}
              onSlideChange={(s) => {
                const pv = typeof s.params?.slidesPerView === 'number' ? s.params.slidesPerView : currentPerView;
                setPageIndex(Math.floor(s.activeIndex / pv));
              }}
              className="pb-2"
            >
              {displayItems.map((it, idx) => {
                const originalIndex = data.findIndex((d) => d.id === it.id);
                return (
                  <SwiperSlide key={`${it.id}-${idx}`}>
                    <Card item={it} index={idx} dataIndex={originalIndex} onPropertyClick={onPropertyClick} isLoggedIn={!!user} livePriceMap={livePriceMap} />
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Gate overlay for guests */}
            {showGate && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Unlock 38 More Premium Properties</h3>
                  <p className="text-gray-600 mb-6">Create a free account to access our complete collection of verified exclusive properties</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => setShowGate(false)} className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 border border-gray-200">May be Later</button>
                    <a href="/#/auth" className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-[#040449] text-white font-semibold hover:opacity-90 shadow">Log In/Sign Up</a>
                  </div>
                </div>
              </div>
            )}

            {/* Dubai-specific gate for guests when clicking the EH Dubai tab */}
            {showDubaiGate && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Unlock 38 More Premium Properties</h3>
                  <p className="text-gray-600 mb-6">Create a free account to access our complete collection of verified exclusive properties</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => setShowDubaiGate(false)} className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 border border-gray-200">May be Later</button>
                    <a href="/#/auth" className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-[#040449] text-white font-semibold hover:opacity-90 shadow">Login/Sign Up</a>
                  </div>
                </div>
              </div>
            )}
            
            <div className="md:hidden mt-6 flex justify-center gap-6">
              <button onClick={goPrev} className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={goNext} className="h-10 w-10 rounded-full bg-slate-800 text-white shadow hover:bg-red-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// Card component - UPDATED
function Card({ item, index, onPropertyClick, dataIndex, isLoggedIn, livePriceMap }) {
  const { id, title, image, location, type, area, price } = item;
  const imgFirst = index % 2 === 0;
  // Normalize labels to avoid duplicate BHK and ensure spacing
  // For For Sale category, ensure first-letter capitalization for "Residential" and "Land"
  const propertyTypeLabel = (() => {
    const base = (item.property_type ? String(item.property_type).replace(/_/g, ' ') : 'Residential').trim();
    const isForSale = (item.categoryNormalized || '').toLowerCase() === 'for sale';
    if (!isForSale) return base;
    const low = base.toLowerCase();
    if (low.includes('Land')) return 'Land';
    if (low.includes('Residential')) return 'Residential';
    return low ? low.charAt(0).toUpperCase() + low.slice(1) : 'Residential';
  })();
  const typeLabel = (() => {
    const t = (type || '').toString();
    return t
      .replace(/BHK\s*BHK/gi, 'BHK')
      .replace(/(\d)\s*BHK/gi, '$1 BHK')
      .trim();
  })();

  const ImageBlock = (
    <div className="relative w-full h-[240px] md:h-[250px] lg:h-[260px] bg-gray-100">
      {isLoggedIn ? (
        <img
          src={pickBestImage(item.raw, image) || PLACEHOLDER}
          srcSet={buildSrcSetFromUrl(pickBestImage(item.raw, image))}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <img
          src={image || PLACEHOLDER}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      {/* Add Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton 
          propertyId={id} 
          variant="floating"
          size="md"
        />
      </div>
    </div>
  );

  const TextBlock = (
    <div className="flex flex-col gap-2 p-4 lg:p-5">
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">
        {title}
      </h3>
      <div className="text-sm text-gray-600">{location}</div>
      {(item.property_type || type) && (
        <div className="text-sm text-gray-600">
          {(() => {
            const catNorm = (item.categoryNormalized || '').toLowerCase();
            if (catNorm === 'luxury rentals') {
              const pt = (() => {
                const base = (item.property_type ? String(item.property_type).replace(/_/g, ' ') : 'Residential').trim();
                const low = base.toLowerCase();
                if (low.includes('Land')) return 'Land';
                if (low.includes('residential')) return 'Residential';
                return low ? low.charAt(0).toUpperCase() + low.slice(1) : 'Residential';
              })();
              let rawType = (item.raw?.type || item.raw?.property_subtype || item.type || '').toString().trim();
              if (rawType) {
                rawType = rawType.replace(/\s*BHK/i, ' BHK').replace(/\s+/g, ' ');
              }
              return rawType ? `${pt} - ${rawType}` : pt;
            }
            return `${propertyTypeLabel}${typeLabel ? `/${typeLabel}` : ''}`;
          })()}
        </div>
      )}
      <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-500">
        <span className="truncate">{area}</span>
        <span className="text-right"></span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        {(() => {
          const cat = (item.categoryNormalized || '').toLowerCase();
          const rawCat = (item.raw?.category || '').toString().trim().toLowerCase();
          // Lists for special handling under For Sale
          // 1) Force Price on Request for these titles (exclude ones that should show value)
          const porTitles = new Set([
            'brigade eternia',
            'l&t elara celestia',
            'sb urban park',
            'sumadhura epitome',
            'century trails',
            'signature one',
            'brigade atmosphere',
            'assetz zen and sato',
          ]);
          // For Sale: if price looks like monthly (K/per month), fetch CRM sale price or show Price on Request
          if (cat === 'for sale') {
            const keyEarly = (item.title || '').toString().trim().toLowerCase();
            const forcePorTitles = new Set(['lodha mirabelle', 'keya life by the lake']);
            if (forcePorTitles.has(keyEarly)) {
              return (
                <div className="text-2xl font-bold text-gray-900">Price on Request</div>
              );
            }
            const priceStrEarly = (price || '').toString();
            const mentionsMonthlyEarly = /(?:\/|per\s*)month\b/i.test(priceStrEarly);
            const hasKUnitEarly = /\b\d+(?:\.\d+)?\s*[kK]\b/.test(priceStrEarly) || /\bthousand\b/i.test(priceStrEarly);
            const hasRentAmountEarly = item.raw && item.raw.rent_amount !== undefined && item.raw.rent_amount !== null;
            if (hasRentAmountEarly || mentionsMonthlyEarly || hasKUnitEarly) {
              const liveEarly = livePriceMap && livePriceMap.get(keyEarly);
              if (liveEarly && liveEarly.display && !liveEarly.isMonthly) {
                return (
                  <div className="text-2xl font-bold text-gray-900">{liveEarly.display}</div>
                );
              }
              return (
                <div className="text-2xl font-bold text-gray-900">Price on Request</div>
              );
            }
          }
          // 2) Titles that should show value without "/month"
          const noMonthTitles = new Set([
            'montira by rare earth',
            'lodha mirabelle',
            'keya life by the lake',
          ]);
          const normalizedTitle = (item.title || '').toString().trim().toLowerCase();
          const normalizedTitleClean = normalizedTitle.replace(/\s+/g, ' ');
          const inNoMonthList = noMonthTitles.has(normalizedTitleClean);
          if (cat === 'for sale' && porTitles.has(normalizedTitleClean)) {
            return (
              <div className="text-2xl font-bold text-gray-900">Price on Request</div>
            );
          }
          // For specific For Sale titles, show value without "/month"
          if (cat === 'for sale' && inNoMonthList) {
            const valuePref = (item.raw && item.raw.rent_amount !== undefined && item.raw.rent_amount !== null)
              ? item.raw.rent_amount
              : price;
            const displayNoMonth = formatRentShort(valuePref);
            return (
              <div className="text-2xl font-bold text-gray-900">{displayNoMonth}</div>
            );
          }
          const priceStr = (price || '').toString();
          const mentionsMonthly = /(?:\/|per\s*)month\b/i.test(priceStr);
          const hasRentAmount = item.raw && item.raw.rent_amount !== undefined && item.raw.rent_amount !== null;
          // Consider EH tabs with rent/lease or rent_amount as monthly as well
          const isMonthly = (
            cat === 'for rent' ||
            cat === 'luxury rentals' ||
            rawCat === 'rent' ||
            rawCat === 'lease' ||
            hasRentAmount ||
            mentionsMonthly
          );
          const valueToFormat = hasRentAmount ? item.raw.rent_amount : price;
          let display = isMonthly ? formatRentShort(valueToFormat) : formatINRShort(valueToFormat);
          const suppressMonthlySuffix = cat === 'luxury rentals' || (cat === 'for sale' && inNoMonthList);
          if (!display) {
            const key = (item.title || '').toString().trim().toLowerCase();
            const live = livePriceMap && livePriceMap.get(key);
            if (live && live.display) {
              const monthly = isMonthly || live.isMonthly;
              return (
                <div className="text-2xl font-bold text-gray-900">
                  {monthly && !suppressMonthlySuffix ? `${live.display}/month` : live.display}
                </div>
              );
            }
          }
          return (
            <div className="text-2xl font-bold text-gray-900">
              {display ? (isMonthly && !suppressMonthlySuffix ? `${display}/month` : display) : (isMonthly && !suppressMonthlySuffix ? '\u20B9—/month' : 'Price on Request')}
            </div>
          );
        })()}
        <Link
          to={`/property/${id}`}
          className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-red-700"
        >
          View Details
        </Link>
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
