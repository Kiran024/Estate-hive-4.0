import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { propertyService } from "../services/propertyService";
import { supabase } from "../util/supabaseClient";
import { Loader2 } from "lucide-react";
import { formatPrice } from "../types/property.types";

const tabs = ["For Sale", "For Rent", "Luxury Rentals", "EH Signature™"];

export default function FeaturedListings() {
  const [activeTab, setActiveTab] = useState("For Sale");
  const [direction, setDirection] = useState(1);
  const [properties, setProperties] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('properties-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'properties' },
        () => {
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const allProperties = {};
      
      for (const tab of tabs) {
        // Map tab names to database categories
        const categoryMap = {
          "For Sale": "sale",
          "For Rent": "rent", 
          "Luxury Rentals": "lease",
          "EH Signature™": "rent_to_own"
        };
        
        const { data } = await propertyService.getAllProperties({
          category: categoryMap[tab],
          status: 'active',
          sortBy: 'created_at',
          sortOrder: 'desc',
          pageSize: 3
        });
        
        allProperties[tab] = (data || []).map(p => ({
          id: p.id,
          title: p.title || p.name || 'Untitled Property',
          location: [p.neighborhood, p.city].filter(Boolean).join(', ') || p.location || 'Location not specified',
          price: formatPrice(p.price || p.rent_amount),
          image: p.image_urls?.[0] || p.featured_image || '/h01@300x-100.jpg'
        }));
      }
      
      setProperties(allProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = tabs.indexOf(tab);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActiveTab(tab);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">Featured Listings</h2>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading properties...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Featured Listings</h2>

      <div className="flex gap-4 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab} {properties[tab]?.length > 0 && `(${properties[tab].length})`}
          </button>
        ))}
      </div>

      <div className="overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {properties[activeTab]?.length > 0 ? (
              properties[activeTab].map((property) => (
                <Link to={`/property/${property.id}`} key={property.id}>
                  <motion.div
                    className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all relative group cursor-pointer h-full"
                    whileHover={{ scale: 1.03 }}
                  >
                    {property.image && (
                      <div className="h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/h01@300x-100.jpg';
                          }}
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-1 line-clamp-2">{property.title}</h3>
                    <p className="text-gray-500 mb-2">{property.location}</p>
                    <p className="text-indigo-600 font-bold mt-3">{property.price}</p>
                    <div className="absolute bottom-4 right-4 text-indigo-600 group-hover:translate-x-1 transition-transform">
                      <HiArrowRight size={24} />
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No properties available in this category</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center mt-8">
        <Link 
          to="/properties" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View All Properties
          <HiArrowRight />
        </Link>
      </div>
    </div>
  );
}