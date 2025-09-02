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
import properties from "../data/properties";
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
    type: p.type || (p.bhk ? `${p.bhk}` : "") || p.propertyType || "",
    area: p.area || p.sqft || p.size || "",
    price: p.price || p.rate || "",
    category: displayCategory,
    categoryNormalized: displayCategory.toString().trim().toLowerCase(),
    subcategory: p.subcategory,
    raw: p,
  };
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
  const sourceData = (Array.isArray(listings) && listings.length > 0) ? listings : properties;
  const data = useMemo(() => sourceData.map(normalize), [sourceData]);

  const [activeTab, setActiveTab] = useState(0);
  const [perView, setPerView] = useState(getPerView());
  const [pageIndex, setPageIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
  };

  const goNext = () => {
    if (pageIndex < totalPages - 1) {
      swiperRef.current?.swiper.slideNext();
      return;
    }
    const nextTab = (activeTab + 1) % TABS.length;
    setActiveTab(nextTab);
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
                onClick={() => setActiveTab(i)}
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
              slidesPerView={perView}
              slidesPerGroup={perView}
              spaceBetween={20}
              onSlideChange={(s) => setPageIndex(Math.floor(s.activeIndex / perView))}
              className="pb-2"
            >
              {items.map((it, idx) => (
                <SwiperSlide key={`${it.id}-${idx}`}>
                  <Card item={it} index={idx} onPropertyClick={onPropertyClick} />
                </SwiperSlide>
              ))}
            </Swiper>
            
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
function Card({ item, index, onPropertyClick }) {
  const { id, title, image, location, type, area, price } = item;
  const imgFirst = index % 2 === 0;

  const ImageBlock = (
    <div className="relative w-full h-[240px] md:h-[250px] lg:h-[260px] bg-gray-100">
      <img
        src={image || PLACEHOLDER}
        alt={title }
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
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
      <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-500">
        <span className="truncate">{area}</span>
        <span className="text-right">{type}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">{price}</div>
        {/* Use onPropertyClick if provided, otherwise direct navigation */}
        {onPropertyClick ? (
          <button
            onClick={(e) => onPropertyClick(index, e)}
            className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-red-700"
          >
            View Details
          </button>
        ) : (
          <Link
            to={`/properties/${id}`}
            className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-red-700"
          >
            View Details
          </Link>
        )}
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