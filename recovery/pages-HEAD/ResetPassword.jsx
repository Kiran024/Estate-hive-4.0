import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../util/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg relative overflow-hidden">
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">Reset Your Password</h2>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ y: -80, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 border border-green-400 px-5 py-3 rounded-lg shadow-md z-20 text-center"
            >
              <strong>Password Updated!</strong>
              <br />Redirecting to Sign In...
            </motion.div>
          )}
        </AnimatePresence>

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition flex justify-center items-center disabled:opacity-60"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            'Reset Password'
          )}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
