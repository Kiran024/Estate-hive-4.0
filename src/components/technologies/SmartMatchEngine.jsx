import React, { useMemo, useState, useRef, useEffect } from "react";
import { FiSliders, FiStar, FiHeart } from "react-icons/fi";
import { Range, getTrackBackground } from "react-range";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { propertyService } from "../../services/propertyService";
import { formatPrice } from "../../types/property.types";

import {
  MapPin, Bed, Bath, Car, Home, Share2, Camera, Square,
  Loader2, AlertCircle
} from "lucide-react";

import WishlistButton from "../common/WishlistButton";

const MIN_PRICE = 100_000;        // ₹1 L
const MAX_PRICE = 250_000_000;    // ₹25 Cr

// simple synonym so a user picking “Bangalore” still matches rows stored as “Bengaluru”
const normalizeCity = (c) => (c === "Bangalore" ? "Bengaluru" : c);

export default function SmartMatchEngine() {
  // --- dynamic lists (match DB values) ---
  const [availableLocations, setAvailableLocations] = useState([
    "Bengaluru", "Bangalore"
  ]);
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState([
    "Residential", "Land"
  ]);

  useEffect(() => {
    // pull unique cities/types so our values exactly match DB
    (async () => {
      try {
        const cities = await propertyService.getUniqueCities();
        if (Array.isArray(cities?.data) && cities.data.length) {
          setAvailableLocations(cities.data);
        }
      } catch {}
      try {
        const types = await propertyService.getUniquePropertyTypes();
        if (Array.isArray(types?.data) && types.data.length) {
          setAvailablePropertyTypes(types.data);
        }
      } catch {}
    })();
  }, []);

  // --- form state (make “Any” the default to avoid unintentional filtering) ---
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [bedrooms, setBedrooms] = useState("");     // '' = Any
  const [bathrooms, setBathrooms] = useState("");   // '' = Any
  const [preferredLocation, setPreferredLocation] = useState("");

  // trigger querying
  const [queryFilters, setQueryFilters] = useState(null);
  const resultsRef = useRef(null);

  // fetch “All” immediately so we show 44 results on first load
  useEffect(() => {
    setQueryFilters({
      propertyType: "all",
      priceRange: [MIN_PRICE, MAX_PRICE],
      bedrooms: "",
      bathrooms: "",
      preferredLocation: ""
    });
  }, []);

  // build query (aligns 1:1 with propertyService expected keys)
  const filtersForQuery = useMemo(() => {
    if (!queryFilters) return null;

    return {
      status: "active",
      property_type: queryFilters.propertyType ?? "all",          // 'all' is ignored by service
      city: queryFilters.preferredLocation
        ? normalizeCity(queryFilters.preferredLocation)
        : "",                                                     // empty -> no city filter
      min_price: queryFilters.priceRange?.[0] ?? "",
      max_price: queryFilters.priceRange?.[1] ?? "",
      bedrooms: queryFilters.bedrooms ?? "",                      // service uses eq() on these
      bathrooms: queryFilters.bathrooms ?? "",
      sortBy: "created_at",
      sortOrder: "desc",
      page: 1,
      pageSize: 60                                                // big page so “All” shows everything
    };
  }, [queryFilters]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["smart-match", filtersForQuery],
    queryFn: () => propertyService.getAllProperties(filtersForQuery),
    enabled: !!filtersForQuery,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const properties = data?.data ?? [];
  const totalCount = data?.count ?? 0;

  const onSubmit = (e) => {
    e.preventDefault();
    setQueryFilters({
      propertyType,
      priceRange,
      bedrooms,
      bathrooms,
      preferredLocation,
    });
  };

  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);

  // --- Card (same visual language as AllPropertiesEnhanced) ---
  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <Link to={`/property/${property.id}`}>
          <img
            src={property.image_urls?.[0] || property.featured_image || "/h01@300x-100.jpg"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => (e.currentTarget.src = "/h01@300x-100.jpg")}
          />
        </Link>

        {property.image_urls?.length > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Camera className="w-3 h-3" />
            <span>{property.image_urls.length}</span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex gap-2">
          <WishlistButton propertyId={property.id} variant="floating" size="sm" />
          <button
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
            }}
            className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-700 hover:text-blue-500" />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">
            {formatPrice(property.price || property.rent_amount)}
          </h3>
          {property.price_negotiable && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Negotiable</span>
          )}
        </div>

        <Link to={`/property/${property.id}`}>
          <h4 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
            {property.title || "Untitled Property"}
          </h4>
        </Link>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {[property.neighborhood, property.city, property.state].filter(Boolean).join(", ") ||
              "Location not specified"}
          </span>
        </div>

        {property.property_type && (
          <div className="flex items-center text-gray-600 mb-3">
            <Home className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm capitalize">
              {property.property_type.replace("_", " ")}
              {property.property_subtype && ` - ${property.property_subtype}`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-gray-600 pt-3 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-3">
            {(property.bedrooms ?? null) !== null && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
            )}
            {(property.bathrooms ?? null) !== null && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            )}
            {property.area_sqft && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.area_sqft} sqft</span>
              </div>
            )}
            {property.parking_spaces > 0 && (
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.parking_spaces}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* HERO */}
      <section
        className="relative w-full min-h-[70vh] md:min-h-[80vh] bg-cover bg-center text-white flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('/smart_match_hero_bg (1).png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl lg:text-2xl font-medium mb-2">AI-Powered</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            Smart Match Engine
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-medium">
            Let artificial intelligence find your perfect property match based <br className="hidden sm:inline" />
            on your unique preferences and investment goals.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-white py-14 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Let&apos;s Find Your <span className="text-red-600">Perfect Match</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl mb-2">Tell us about your preferences and investment goals.</p>
            <p className="text-gray-600 text-base md:text-lg">Our AI-powered engine will analyze thousands of properties to find your ideal matches.</p>
          </div>

          <div className="bg-neutral-100 rounded-3xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] p-6 sm:p-8 md:p-10 lg:p-12 max-w-4xl mx-auto">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left">
              {/* Property Type */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Property Type</label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg bg-neutral-200 border border-gray-200 shadow-[inset_2px_2px_5px_#BABECC,_inset_-5px_-5px_10px_#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700"
                  >
                    <option value="all">All</option>
                    {/* use DB-backed values to avoid mismatches */}
                    {[...new Set(availablePropertyTypes)].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Bedrooms</label>
                <div className="relative">
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg bg-neutral-200 border border-gray-200 shadow-[inset_2px_2px_5px_#BABECC,_inset_-5px_-5px_10px_#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2">
                <label className="block text-gray-800 font-semibold mb-6">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </label>
                <div className="relative flex items-center h-8">
                  <Range
                    values={priceRange}
                    step={10000}
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    onChange={setPriceRange}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: "6px",
                          width: "100%",
                          borderRadius: "3px",
                          background: getTrackBackground({
                            values: priceRange,
                            colors: ["#E0E0E0", "#EF4444", "#E0E0E0"],
                            min: MIN_PRICE,
                            max: MAX_PRICE,
                          }),
                          alignSelf: "center",
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: "24px",
                          width: "24px",
                          borderRadius: "50%",
                          backgroundColor: "#FFF",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "2px solid #EF4444",
                          outline: "none",
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Bathrooms</label>
                <div className="relative">
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg bg-neutral-200 border border-gray-200 shadow-[inset_2px_2px_5px_#BABECC,_inset_-5px_-5px_10px_#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Preferred Location */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Preferred Location</label>
                <div className="relative">
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg bg-neutral-200 border border-gray-200 shadow-[inset_2px_2px_5px_#BABECC,_inset_-5px_-5px_10px_#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700"
                  >
                    <option value="">All Locations</option>
                    {[...new Set(availableLocations)].map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 text-center mt-6 md:mt-8">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-10 py-4 rounded-full shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] hover:shadow-[inset_2px_2px_5px_#BABECC,_inset_-5px_-5px_10px_#FFFFFF] transition duration-300 ease-in-out w-full md:w-auto"
                >
                  Find My Match
                </button>
              </div>
            </form>
          </div>

          {/* RESULTS */}
          <div ref={resultsRef} className="max-w-6xl mx-auto mt-10 md:mt-14 text-left">
            {isFetching && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Fetching properties…</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Error loading properties</p>
                  <p className="text-red-600 text-sm">{String(error.message || error)}</p>
                </div>
              </div>
            )}

            {!!filtersForQuery && !isFetching && !error && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-700">
                    Found <span className="font-semibold">{totalCount}</span> matching properties
                  </p>
                </div>

                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((p) => (
                      <PropertyCard key={p.id} property={p} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
                    <p className="text-gray-600">Try broadening your filters or choose “All”.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#2A2A3F] py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How Our Smart Match <span className="text-red-600">Engine Works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: FiSliders, title: "Smart Filtering", desc: "Our AI analyzes your preferences and filters through thousands of properties to find the best matches." },
              { icon: FiStar, title: "Compatibility Scoring", desc: "Each property receives a compatibility score based on how well it matches your specific criteria." },
              { icon: FiHeart, title: "Personalized Results", desc: "Get curated recommendations that align with your lifestyle, budget, and investment goals." },
            ].map((f, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                <f.icon className="h-24 w-24 mb-6 text-white" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-base text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}