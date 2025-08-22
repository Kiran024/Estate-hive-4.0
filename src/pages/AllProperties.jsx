// import React, { useState, useMemo } from 'react';
// import properties from '../data/properties';

// const categories = ["All", "For Sale", "For Rent", "Luxury Rentals", "EH Signature™"];

// const ModernSelect = ({ value, onChange, children }) => (
//   <div className="relative">
//     <select
//       value={value}
//       onChange={onChange}
//       className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
//     >
//       {children}
//     </select>
//     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
//       <svg
//         className="h-4 w-4"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//       </svg>
//     </div>
//   </div>
// );

// const parsePrice = (str) => {
//   const nums = [];
//   let lastUnit = 'CR';
//   const cleaned = str.toUpperCase().replace(/-/g, ' ');
//   const regex = /(\d+(?:\.\d+)?)(?:\s*)(CR|L)?/g;
//   let match;
//   while ((match = regex.exec(cleaned)) !== null) {
//     let value = parseFloat(match[1]);
//     const unit = match[2] || lastUnit;
//     lastUnit = unit;
//     if (unit === 'L') value /= 100;
//     nums.push(value);
//   }
//   if (!nums.length) return { min: 0, max: 0 };
//   return { min: Math.min(...nums), max: Math.max(...nums) };
// };

// export default function AllProperties() {
//   const enriched = useMemo(
//     () =>
//       properties.map((p) => {
//         const { min, max } = parsePrice(p.price);
//         return { ...p, priceMin: min, priceMax: max };
//       }),
//     []
//   );

//   const locations = useMemo(
//     () => Array.from(new Set(enriched.map((p) => p.location))),
//     [enriched]
//   );
//   const minPriceGlobal = Math.min(...enriched.map((p) => p.priceMin));
//   const maxPriceGlobal = Math.max(...enriched.map((p) => p.priceMax));

//   const [search, setSearch] = useState('');
//   const [category, setCategory] = useState('All');
//   const [location, setLocation] = useState('All');
//   const [sort, setSort] = useState('default');
//   const [minPrice, setMinPrice] = useState(minPriceGlobal);
//   const [maxPrice, setMaxPrice] = useState(maxPriceGlobal);

//   const filtered = useMemo(
//     () =>
//       enriched.filter((p) => {
//         const term = search.toLowerCase();
//         const matchesSearch =
//           p.title.toLowerCase().includes(term) ||
//           p.location.toLowerCase().includes(term);
//         const matchesCategory = category === 'All' || p.category === category;
//         const matchesLocation = location === 'All' || p.location === location;
//         const matchesPrice =
//           p.priceMin >= minPrice && p.priceMin <= maxPrice;
//         return (
//           matchesSearch &&
//           matchesCategory &&
//           matchesLocation &&
//           matchesPrice
//         );
//       }),
//     [enriched, search, category, location, minPrice, maxPrice]
//   );

//   const sorted = useMemo(() => {
//     const arr = [...filtered];
//     if (sort === 'asc') arr.sort((a, b) => a.priceMin - b.priceMin);
//     else if (sort === 'desc') arr.sort((a, b) => b.priceMin - a.priceMin);
//     return arr;
//   }, [filtered, sort]);

//   const handleMinPriceChange = (e) => {
//     const value = parseFloat(e.target.value);
//     setMinPrice(value);
//     if (value > maxPrice) setMaxPrice(value);
//   };

//   const handleMaxPriceChange = (e) => {
//     const value = parseFloat(e.target.value);
//     setMaxPrice(value);
//     if (value < minPrice) setMinPrice(value);
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen pt-28 pb-10 ">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-4xl font-bold text-gray-800 mb-10 text-left">Browse All Properties</h1>
//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Sidebar Filters */}
//           <aside className="md:w-1/4 bg-white rounded-xl shadow-md p-6 space-y-6 mr-10 h-fit sticky top-28">
//             <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700" htmlFor="search">Search</label>
//               <input
//                 id="search"
//                 type="text"
//                 placeholder="Search by title or location"
//                 className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Category</label>
//               <ModernSelect value={category} onChange={(e) => setCategory(e.target.value)}>
//                 {categories.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </ModernSelect>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Location</label>
//               <ModernSelect value={location} onChange={(e) => setLocation(e.target.value)}>
//                 <option value="All">All</option>
//                 {locations.map((loc) => (
//                   <option key={loc} value={loc}>
//                     {loc}
//                   </option>
//                 ))}
//               </ModernSelect>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Price Range (Cr)</label>
//               <input
//                 type="range"
//                 min={minPriceGlobal}
//                 max={maxPriceGlobal}
//                 step="0.01"
//                 value={minPrice}
//                 onChange={handleMinPriceChange}
//                 className="w-full bg-indigo-900"
//               />
//               <input
//                 type="range"
//                 min={minPriceGlobal}
//                 max={maxPriceGlobal}
//                 step="0.01"
//                 value={maxPrice}
//                 onChange={handleMaxPriceChange}
//                 className="w-full bg-indigo-900"
//               />
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>{minPrice.toFixed(2)}</span>
//                 <span>{maxPrice.toFixed(2)}</span>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Sort By</label>
//               <ModernSelect value={sort} onChange={(e) => setSort(e.target.value)}>
//                 <option value="default">Most Demand</option>
//                 <option value="asc">Price: Low to High</option>
//                 <option value="desc">Price: High to Low</option>
//               </ModernSelect>
//             </div>
//           </aside>

//           {/* Properties Grid */}
//           <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {sorted.map((p, idx) => (
//               <div
//                 key={idx}
//                 className="bg-white rounded-xl border border-gray-100 shadow hover:shadow-xl transition overflow-hidden"
//               >
//                 <img
//                   src={p.image}
//                   alt={p.title}
//                   className="w-full h-56 object-cover"
//                 />
//                 <div className="p-5 space-y-1">
//                   <h2 className="text-xl font-semibold text-gray-800">{p.title}</h2>
//                   <p className="text-sm text-indigo-600">{p.category}</p>
//                   <p className="text-gray-500">{p.location}</p>
//                   <p className="text-indigo-600 font-bold">{p.price}</p>
//                   <button className="bg-red-600 text-white text-[12px] cursor-pointer font-semibold px-3 py-1 rounded-full shadow hover:bg-red-700 transition duration-300">
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState, useMemo } from 'react';
import properties from '../data/properties';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from "react-router-dom";
import { Range } from 'react-range';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'For Sale', 'For Rent', 'Luxury Rentals', 'EH Signature™'];

// --- HELPER COMPONENTS AND FUNCTIONS (UNCHANGED) ---

const ModernSelect = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

const parsePrice = (str) => {
  const nums = [];
  let lastUnit = 'CR';
  const cleaned = str.toUpperCase().replace(/-/g, ' ');
  const regex = /(\d+(?:\.\d+)?)(?:\s*)(CR|L)?/g;
  let match;
  while ((match = regex.exec(cleaned)) !== null) {
    let value = parseFloat(match[1]);
    const unit = match[2] || lastUnit;
    lastUnit = unit;
    if (unit === 'L') value /= 100;
    nums.push(value);
  }
  if (!nums.length) return { min: 0, max: 0 };
  return { min: Math.min(...nums), max: Math.max(...nums) };
};

const formatPrice = (value) => {
    // Formats numbers into ₹XX L or ₹XX.XX Cr strings
    if (value < 1) {
        return `₹${(value * 100).toFixed(0)} L`;
    }
    return `₹${value.toFixed(2)} Cr`;
};


// --- MAIN COMPONENT ---

export default function AllProperties() {
  // --- MODIFICATION 1: DEFINE FIXED PRICE RANGE ---
  const MIN_PRICE = 0.75; // 75 Lakhs
  const MAX_PRICE = 25;   // 25 Crores

  const enriched = useMemo(
    () =>
      properties.map((p) => {
        const { min, max } = parsePrice(p.price);
        return { ...p, priceMin: min, priceMax: max };
      }),
    []
  );

  const locations = useMemo(
    () => Array.from(new Set(enriched.map((p) => p.location))),
    [enriched]
  );

  // State variables
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [sort] = useState('default');
  
  // --- MODIFICATION 2: INITIALIZE STATE WITH FIXED RANGE ---
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [rangeOpen, setRangeOpen] = useState(false);

  const filtered = useMemo(
    () =>
      enriched.filter((p) => {
        const term = search.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(term) || p.location.toLowerCase().includes(term);
        const matchesCategory = category === 'All' || p.category === category;
        const matchesLocation = location === 'All' || p.location === location;
        
        // Filter logic: property's min price must be within the selected range
        const matchesPrice = p.priceMin >= priceRange[0] && p.priceMin <= priceRange[1];
        
        return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
      }),
    [enriched, search, category, location, priceRange]
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === 'asc') arr.sort((a, b) => a.priceMin - b.priceMin);
    else if (sort === 'desc') arr.sort((a, b) => b.priceMin - a.priceMin);
    return arr;
  }, [filtered, sort]);

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-left">Browse All Properties</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="md:w-1/4 bg-white rounded-xl shadow-md p-6 space-y-6 mr-10 h-fit sticky top-28">
            <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="search">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by title or location"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <ModernSelect value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </ModernSelect>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <ModernSelect value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="All">All</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </ModernSelect>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <div className="relative">
                <div
                  className="w-full flex items-center justify-between text-sm text-gray-800 font-medium cursor-pointer"
                  onClick={() => setRangeOpen((prev) => !prev)}
                >
                  <span>
                    {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                  </span>
                  <FiChevronDown size={18} className="text-gray-600" />
                </div>
                <AnimatePresence>
                  {rangeOpen && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white p-4 rounded-xl shadow-lg mt-2 z-40"
                    >
                      {/* --- MODIFICATION 3: SET FIXED MIN/MAX ON SLIDER --- */}
                      <Range
                        step={0.25} // Step by 25 Lakhs
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        values={priceRange}
                        onChange={setPriceRange}
                        renderTrack={({ props, children }) => (
                          <div {...props} className="h-1 bg-gray-300 rounded" style={props.style}>
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div {...props} className="h-4 w-4 bg-[#1F275E] rounded-full shadow-md" />
                        )}
                      />
                      <p className="mt-2 text-center text-sm text-gray-700">
                        {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                      </p>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </aside>

          {/* Properties Grid (UNCHANGED) */}
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 shadow hover:shadow-xl transition overflow-hidden flex flex-col h-full"
              >
                <img
                  src={p.image && p.image.length ? p.image[0] : "/images/properties/placeholder.jpg"}
                  alt={p.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5 flex flex-col flex-1">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-800">{p.title}</h2>
                    <p className="text-sm text-[#1B1B59]">{p.category}</p>
                    <p className="text-gray-500">{p.location}</p>
                  </div>
                  <div className="mt-auto flex flex-col items-start">
                    <p className="text-[#1B1B59] font-bold">{p.price}</p>
                    <Link
                      to={`/properties/${p.id}`}
                      className="mt-2 self-start w-fit bg-[#1F275E] text-white text-[12px] font-semibold px-3 py-1 rounded-full shadow hover:bg-[#0f1646] transition duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
