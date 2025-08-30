
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
// import logo from '../assets/logo01.svg';
// import { motion, AnimatePresence } from 'framer-motion';

// const supabaseUrl =  'https://qfmglenbyvhfrydozzqp.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbWdsZW5ieXZoZnJ5ZG96enFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTksImV4cCI6MjA2ODM1MzUxOX0.KgiS9wmPVCnGCxYxLE2wSKRgwYwXvLU-j8UtIpmDUfQ';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const AuthPage = () => {
//   const navigate = useNavigate();
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === 'SIGNED_IN' && session?.user) navigate('/');
//     });
//     return () => listener.subscription.unsubscribe();
//   }, [navigate]);

//   const handleSignIn = async () => {
//   setLoading(true);
//   setMessage('');
//   setSuccess(false);

//   const { error, data } = await supabase.auth.signInWithPassword({ email, password });

//   if (error) {
//     setMessage(error.message);
//     setLoading(false);
//   } else {
//     setMessage('Signed in successfully!');
//     setSuccess(true); // ✅ show success popup

//     // ⏳ wait for 3 seconds before redirect
//     setTimeout(() => {
//       navigate('/');
//     }, 3000);
//   }
// };
//   const handleGoogleSignIn = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: { redirectTo: window.location.origin },
//     });
//     if (error) alert(error.message);
//   };

//   const handleLinkedInSignIn = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'linkedin_oidc',
//       options: { redirectTo: window.location.origin },
//     });
//     if (error) alert(error.message);
//   };

//   const handleForgotPassword = async () => {
//     setLoading(true);
//     setMessage('');
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/auth-reset`, // make sure this route exists to handle reset
//     });
//     if (error) {
//       setMessage(error.message);
//     } else {
//       setMessage('Password reset email sent! Check your inbox.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-100 px-4">
//       <div className="relative w-full max-w-sm h-[700px] perspective">
//         <div className={`transition-transform duration-700 relative w-full h-full transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
//           {/* ---- Login Card ---- */}
//           <div className="absolute w-full h-full bg-white p-8 rounded-lg shadow-md backface-hidden">
//             <img src={logo} alt="Logo" className="mx-auto h-12 mb-4" />
//             <h2 className="text-2xl font-semibold text-center mb-1">Login</h2>
//             <p className="text-sm text-gray-900 mb-4 text-center">Unlock Your Dream Property</p>

//             <button onClick={handleGoogleSignIn} className="w-full bg-white border border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition text-gray-700 py-2 rounded-lg mb-3 flex items-center justify-center">
//               <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
//               Sign in with Google
//             </button>

//             <button onClick={handleLinkedInSignIn} className="w-full bg-white border border-gray-300 hover:border-blue-700 hover:text-blue-700 transition text-gray-700 py-2 rounded-lg mb-4 flex items-center justify-center">
//               {/* LinkedIn SVG icon */}
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
//                 <path fill="#0077B5" d="M34,20.5v12.8h-7.3v-11.9c0-3-1.1-5-3.8-5c-2.1,0-3.3,1.4-3.8,2.8c-0.2,0.5-0.2,1.1-0.2,1.7v12.3H11.6c0,0,0.1-20,0-22.1h7.3v3.1c1-1.5,2.8-3.6,6.8-3.6C30.5,10.6,34,13.4,34,20.5z M3.8,0.5C1.7,0.5,0,2.1,0,4.1c0,2,1.6,3.6,3.8,3.6c2.2,0,3.7-1.6,3.8-3.6C7.6,2.1,6,0.5,3.8,0.5z M0.4,33.3H7V11.2H0.4V33.3z" />
//               </svg>
//               Sign in with LinkedIn
//             </button>

//             <div className="flex items-center my-3">
//               <div className="flex-grow border-t border-gray-300" />
//               <span className="mx-2 text-gray-400 text-sm">or</span>
//               <div className="flex-grow border-t border-gray-300" />
//             </div>
//             {success && (
//   <AnimatePresence>
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-lg shadow-lg z-10 text-center text-sm"
//     >
//       ✅ Login Successful! Redirecting...
//     </motion.div>
//   </AnimatePresence>
// )}
//             <input type="email" placeholder="Email" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="password" placeholder="Password" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={password} onChange={(e) => setPassword(e.target.value)} />

//             <button onClick={handleForgotPassword} className="text-indigo-600 text-sm hover:underline block mb-3 text-left">
//               Forgot password?
//             </button>

//             <button
//   onClick={handleSignIn}
//   className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition mb-3 flex justify-center items-center"
//   disabled={loading}
// >
//   {loading ? (
//     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//     </svg>
//   ) : (
//     'Submit'
//   )}
// </button>

//             <button onClick={() => navigate('/')} className="mx-auto block text-sm px-4 py-1 border border-gray-400 rounded-md hover:bg-gray-100 transition">
//               Back to Home
//             </button>

//             {message && <p className="text-sm text-center text-gray-700 mt-3">{message}</p>}

//             <p className="text-sm mt-4">
//               Don’t have an account?{' '}
//               <button onClick={() => setIsFlipped(true)} className="text-indigo-600 hover:underline">Sign Up</button>
//             </p>
//           </div>

// //           {/* ---- Sign Up Card ---- */}
// //           <div className="absolute w-full h-full bg-white p-8 rounded-lg shadow-md rotate-y-180 backface-hidden">
// //             <img src={logo} alt="Logo" className="mx-auto h-12 mb-4" />
// //            <h2 className="text-3xl font-extrabold mb-1 text-center">Welcome to Estate Hive</h2>
// //             <p className="text-sm text-bold mb-4 text-center">Unlock Your Dream Property</p>

// //             <button onClick={handleGoogleSignIn} className="w-full bg-white border border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition text-gray-700 py-2 rounded-lg mb-3 flex items-center justify-center">
// //               <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
// //               Sign up with Google
// //             </button>

// //             <button onClick={handleLinkedInSignIn} className="w-full bg-white border border-gray-300 hover:border-blue-700 hover:text-blue-700 transition text-gray-700 py-2 rounded-lg mb-4 flex items-center justify-center">
// //               {/* LinkedIn SVG */}
// //               <svg className="w-5 h-5 mr-2" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
// //                 <path fill="#0077B5" d="..." />
// //               </svg>
// //               Sign up with LinkedIn
// //             </button>

// //             <input type="email" placeholder="Email" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={email} onChange={(e) => setEmail(e.target.value)} />
// //             <input type="password" placeholder="Password" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={password} onChange={(e) => setPassword(e.target.value)} />
// //             <input type="tel" placeholder="Phone Number" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={phone} onChange={(e) => setPhone(e.target.value)} />

// //             <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition mb-3">
// //               Sign In
// //             </button>

// //             <p className="text-1xl text-center text-extrabold mt-2">
// //               By creating an account you agree to our&nbsp;
// //             <a href="#" className="text-indigo-600 underline">Terms of Service</a> and&nbsp;
// //             <a href="#" className="text-indigo-600 underline">Privacy Policy</a>
// //             </p>

// //             <button onClick={() => navigate('/')} className="mx-auto block text-sm px-4 py-1  my-3 border border-gray-400 rounded-md hover:bg-gray-100 transition">
// //               Back to Home
// //             </button>

// //             <p className="text-sm mt-4">
// //               Already have an account?{' '}
// //               <button onClick={() => setIsFlipped(false)} className="text-indigo-600 hover:underline">Login</button>
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthPage;



import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../util/supabaseClient';
import { authService } from '../services/authService';
import logo from '../assets/logo01.svg';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
const [showTermsToast, setShowTermsToast] = useState(false);


  useEffect(() => {
    // Check for error from navigation state
    if (location.state?.error) {
      setMessage(location.state.error);
      setSuccess(false);
    }

    // Store redirect path if provided
    if (location.state?.from) {
      localStorage.setItem('authRedirectTo', location.state.from);
    }

    // Handle OAuth callback
    if (window.location.hash && window.location.hash.includes('access_token')) {
      authService.handleOAuthCallback().then(() => {
        const from = localStorage.getItem('authRedirectTo') || location.state?.from || '/';
        localStorage.removeItem('authRedirectTo');
        navigate(from);
      });
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const from = localStorage.getItem('authRedirectTo') || location.state?.from || '/';
        localStorage.removeItem('authRedirectTo');
        navigate(from);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate, location]);

  const handleSignIn = async () => {
    setLoading(true);
    setMessage('');
    setSuccess(false);

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      setMessage('Signed in successfully!');
      setSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage('');
     if (!termsAccepted) {
    setShowTermsToast(true);
    setTimeout(() => setShowTermsToast(false), 1000);
    return;
  }

  setLoading(true);
  setMessage('');
  const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    
    emailRedirectTo: `${window.location.origin}/confirmed`,
  },
});

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Account created! Please check your email to confirm.');
      setIsFlipped(false);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithProvider('google');
    } catch (error) {
      setMessage(error.message);
    }
  };
  const handleLinkedInSignIn = async () => {
    try {
      await authService.signInWithProvider('linkedin_oidc');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLinkedInSignIn_OLD = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo: window.location.origin },
    });
    if (error) alert(error.message);
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth-reset`,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset email sent! Check your inbox.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-100 px-4">
      <div className="relative w-full max-w-sm h-[700px] perspective">
              <div className={`transition-transform duration-700 absolute w-full h-full transform-style-preserve-3d ${isFlipped ? 'rotate-x-180' : 'rotate-x-0'}`}>
          {/* ---- Login Card ---- */}
                    {/* ---- Login Card ---- */}
                  <div className="absolute w-full h-full bg-white p-8 rounded-lg shadow-md backface-hidden">
            <img src={logo} alt="Logo" className="mx-auto h-12 mb-4" />
            <h2 className="text-2xl font-semibold text-center mb-1">Login</h2>
            <p className="text-sm text-gray-900 mb-4 text-center">Unlock Your Dream Property</p>

            <button
    onClick={handleGoogleSignIn}
    className="w-full bg-white border border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition text-gray-700 py-2 rounded-lg mb-3 flex items-center justify-center"
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google"
      className="w-5 h-5 mr-2"
    />
    Sign in with Google
  </button>

            <button onClick={handleLinkedInSignIn} className="w-full bg-white border border-gray-300 hover:border-blue-700 hover:text-blue-700 transition text-gray-700 py-2 rounded-lg mb-4 flex items-center justify-center">
              {/* LinkedIn SVG icon */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                <path fill="#0077B5" d="M34,20.5v12.8h-7.3v-11.9c0-3-1.1-5-3.8-5c-2.1,0-3.3,1.4-3.8,2.8c-0.2,0.5-0.2,1.1-0.2,1.7v12.3H11.6c0,0,0.1-20,0-22.1h7.3v3.1c1-1.5,2.8-3.6,6.8-3.6C30.5,10.6,34,13.4,34,20.5z M3.8,0.5C1.7,0.5,0,2.1,0,4.1c0,2,1.6,3.6,3.8,3.6c2.2,0,3.7-1.6,3.8-3.6C7.6,2.1,6,0.5,3.8,0.5z M0.4,33.3H7V11.2H0.4V33.3z" />
              </svg>
              Sign in with LinkedIn
            </button>

            <div className="flex items-center my-3">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>
            {success && (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-lg shadow-lg z-10 text-center text-sm"
    >
      ✅ Login Successful! Redirecting...
    </motion.div>
  </AnimatePresence>
)}
            <input type="email" placeholder="Email" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button onClick={handleForgotPassword} className="text-indigo-600 text-sm hover:underline block mb-3 text-left">
              Forgot password?
            </button>

            <button
  onClick={handleSignIn}
  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition mb-3 flex justify-center items-center"
  disabled={loading}
>
  {loading ? (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
  ) : (
    'Submit'
  )}
</button>

            <button onClick={() => navigate('/')} className="mx-auto block text-sm px-4 py-1 border border-gray-400 rounded-md hover:bg-gray-100 transition">
              Back to Home
            </button>

            {message && <p className="text-sm text-center text-gray-700 mt-3">{message}</p>}

            <p className="text-sm mt-4">
              Don’t have an account?{' '}
              <button onClick={() => setIsFlipped(true)} className="text-indigo-600 hover:underline">Sign Up</button>
            </p>
          </div>

          

          {/* (no changes here) */}

          {/* ---- Sign Up Card ---- */}
                  <div className="absolute w-full h-full bg-white p-8 rounded-lg shadow-md backface-hidden" style={{ transform: 'rotateX(180deg)' }}>
            <img src={logo} alt="Logo" className="mx-auto h-12 mb-4" />
            <h2 className="text-3xl font-extrabold mb-1 text-center">Welcome to Estate Hive</h2>
            <p className="text-sm text-bold mb-4 text-center">Unlock Your Dream Property</p>
<button
    onClick={handleGoogleSignIn}
    className="w-full bg-white border border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition text-gray-700 py-2 rounded-lg mb-3 flex items-center justify-center"
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google"
      className="w-5 h-5 mr-2"
    />
    Sign up with Google
  </button>
            <button onClick={handleLinkedInSignIn} className="w-full bg-white border border-gray-300 hover:border-blue-700 hover:text-blue-700 transition text-gray-700 py-2 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                <path fill="#0077B5" d="M34,20.5v12.8h-7.3v-11.9c0-3-1.1-5-3.8-5c-2.1,0-3.3,1.4-3.8,2.8c-0.2,0.5-0.2,1.1-0.2,1.7v12.3H11.6c0,0,0.1-20,0-22.1h7.3v3.1c1-1.5,2.8-3.6,6.8-3.6C30.5,10.6,34,13.4,34,20.5z M3.8,0.5C1.7,0.5,0,2.1,0,4.1c0,2,1.6,3.6,3.8,3.6c2.2,0,3.7-1.6,3.8-3.6C7.6,2.1,6,0.5,3.8,0.5z M0.4,33.3H7V11.2H0.4V33.3z" />
              </svg>
              Sign up with LinkedIn
            </button>

            <input type="email" placeholder="Email" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" value={password} onChange={(e) => setPassword(e.target.value)} />
            {showTermsToast && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm mb-3 text-center">
    Please accept the Terms of Service and Privacy Policy to continue.
  </div>
)}

            <button
  onClick={handleSignUp}
  disabled={!termsAccepted || loading}
  className={`w-full py-2 rounded-md transition mb-3 flex justify-center items-center
    ${termsAccepted ? 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600' : 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'}
  `}
>
  {loading ? (
    <svg
      className="animate-spin h-5 w-5 text-white mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
  ) : (
    'Sign Up'
  )}
</button>



<div className="flex items-start mb-3">
  <input
    type="checkbox"
    id="terms"
    className="mt-1 mr-2"
    checked={termsAccepted}
    onChange={() => setTermsAccepted(!termsAccepted)}
  />
  <label htmlFor="terms" className="text-sm text-gray-700">
    I agree to the&nbsp;
    <a href="#" className="text-indigo-600 underline">Terms of Service</a> and&nbsp;
    <a href="#" className="text-indigo-600 underline">Privacy Policy</a>
  </label>
</div>
<button
  onClick={handleSignUp}
  className=""
   ></button>
            <button onClick={() => navigate('/')} className="mx-auto block text-sm px-4 py-1  my-3 border border-gray-400 rounded-md hover:bg-gray-100 transition">
              Back to Home
            </button>

            <p className="text-sm mt-4">
              Already have an account?{' '}
              <button onClick={() => setIsFlipped(false)} className="text-indigo-600 hover:underline">Login</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
