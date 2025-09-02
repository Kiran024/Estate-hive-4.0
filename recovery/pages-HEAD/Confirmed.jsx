import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Confirmed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md"
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">✅ Email Confirmed!</h2>
        <p className="text-gray-700 mb-6">Your account is now verified.</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition">
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default Confirmed;