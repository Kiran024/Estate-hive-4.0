import React from 'react';
import PropertyGrid from '../components/properties/PropertyGrid';
import { motion } from 'framer-motion';

const AllProperties = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Dream Property
          </h1>
          <p className="text-xl opacity-90">
            Discover the perfect home from our extensive collection of properties
          </p>
        </div>
      </motion.div>

      {/* Properties Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <PropertyGrid showFilters={true} />
      </motion.div>
    </div>
  );
};

export default AllProperties;