import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  useEffect(() => {
    // Load Trustpilot widget script
    const script = document.createElement("script");
    script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <footer className="bg-[#1e2235] text-white">
      {/* Top CTA Section */}
      <div className="text-center py-20 px-6 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Ready to Find Your <span className="text-red-500">Dream Property?</span>
        </h2>
        <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied clients who found their perfect property through our AI-powered platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
  {/* Button 1: Get Smart Matched (navigates) */}
<Link
  to="/smart-match-engine"
  aria-label="Get Smart Matched"
  className="relative flex items-center justify-center overflow-hidden px-8 py-4 rounded-md text-[#475569] font-semibold shadow-md bg-[#F3F4F6] text-lg transition-all duration-300 hover:text-white group"
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
  <span className="absolute h-0 w-0 rounded-full bg-[#040449] duration-500 ease-out group-hover:h-56 group-hover:w-59 z-0" />
  <span className="relative z-10">Get Smart Matched</span>
</Link>

  {/* Button 2: Book Consultation (navigates) */}
<Link
  to="/contact-us"
  aria-label="Book Consultation"
  className="relative flex items-center justify-center overflow-hidden px-8 py-4 rounded-md text-[#475569] font-semibold shadow-md bg-[#F3F4F6] text-lg transition-all duration-300 hover:text-white group"
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
  {/* If you don't have custom w-58 in Tailwind, use w-56 so the ripple works */}
  <span className="absolute h-0 w-0 rounded-full bg-[#E7000B] duration-500 ease-out group-hover:h-56 group-hover:w-56 z-0" />
  <span className="relative z-10">Book Consultation</span>
</Link>
</div>
      </div>

      {/* Mid Footer Section - Restructured into two main columns */}
      <div className="bg-gray-100 text-black px-6 sm:px-10 lg:px-40 py-12">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-y-12 lg:gap-y-0 lg:gap-x-1">
          {/* Left Section: Logo, Description, Socials, Trustpilot */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <img src="/EH_Logo@300x-8.png" alt="Estate Hive" className="w-55 h-[70px] mb-4" />
            <p className="text-sm text-gray-600 max-w-xs mb-6">
              Curated experiences. Data-backed confidence. Real results.
            </p>
            <div className="flex space-x-4 mb-8">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF className="text-gray-600 hover:text-orange-500 transition text-xl cursor-pointer" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="text-gray-600 hover:text-orange-500 transition text-xl cursor-pointer" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-gray-600 hover:text-orange-500 transition text-xl cursor-pointer" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn className="text-gray-600 hover:text-orange-500 transition text-xl cursor-pointer" />
              </a>
            </div>
            {/* Trustpilot Widget */}
            <div className="w-full max-w-[240px] mx-0 lg:mx-0"> {/* Adjusted max-width for better fit */}
              <div
                className="trustpilot-widget"
                data-locale="en-US"
                data-template-id="56278e9abfbbba0bdcd568bc"
                data-businessunit-id="68773340ee94874fe923b1d3"
                data-style-height="52px"
                data-style-width="100%"
                dangerouslySetInnerHTML={{
                  __html: `
                    <a href="https://www.trustpilot.com/review/estatehive.in" target="_blank" rel="noopener">Trustpilot</a>
                  `,
                }}
              />
            </div>
          </div>

          {/* Right Section: Services, Technology, Quick Links, Contact */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-3">
            {/* Services */}
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">EH Verified™</Link></li>
                <li><Link to="/eh-commercial" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">EH Commercial™</Link></li>
                <li><Link to="/eh-living" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">EH Living™</Link></li>
                <li><Link to="/eh-stay" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">EH Stay™</Link></li>
                <li><Link to="/eh-signature" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">EH Signature™</Link></li>
                <li><Link to="/eh-design" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">EH Design™</Link></li>
              </ul>
            </div>

            {/* Technology */}
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg mb-4">Technology</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/eh-geoheat" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">GeoHeat™</Link></li>
                <li><Link to="/eh-rank" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">EH Rank™</Link></li>
                <li><Link to="/ai-agent-ecosystem" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">AI Agents</Link></li>
                <li><Link to="/smart-match-engine" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Smart Match</Link></li>
                <li><Link to="/eh-accelerate" className="hover:text-orange-500 transition-all hover:underline underline-offset-4">EH Accelerate™</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 gap-y-4"> {/* Stacks Corporate/Residential on mobile */}
                <div>
                  <h4 className="font-semibold text-md text-gray-800 mb-2">Corporate</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Office Space in Bangalore</li>
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Office Space in Hyderabad</li>
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Office Space in Pune</li>
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Office Space In Mumbai</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-md text-gray-800 mb-2">Residential</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Explore Properties</li>
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Smart Homes</li>
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Premium Homes</li>
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Luxury Homes</li>
                    <li className="hover:text-orange-500 transition-all hover:underline underline-offset-4">Ultra Luxury Homes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start justify-center sm:justify-start gap-3 hover:text-orange-500 transition-all cursor-pointer">
                  <FaPhoneAlt className="text-gray-600 text-xl flex-shrink-0 mt-1" />
                  <div className="text-left">
                    +91 9036317764 <br />
                    +91 9036317765 <br />
                    +91 9036317766
                  </div>
                </li>
                <li className="flex items-start justify-center sm:justify-start gap-3 hover:text-orange-500 transition-all cursor-pointer">
                  <FaEnvelope className="text-gray-600 text-xl flex-shrink-0 mt-1" />
                  <span className="text-left">hello@estatehive.in</span>
                </li>
                <li className="flex items-start justify-center sm:justify-start gap-3 hover:text-orange-500 transition-all cursor-pointer">
                  <FaMapMarkerAlt className="text-gray-600 text-xl flex-shrink-0 mt-1" />
                  <address className="not-italic text-left">
                    89, 6th Cross Rd, Bidarahalli Hobli, Narayanapura, Byrathi,<br /> Bengaluru, Karnataka 560077
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright and Policy Links */}
        <div className="mt-20 border-t border-gray-300 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex flex-wrap justify-center sm:justify-start space-x-4 mb-2 sm:mb-0">
            <Link to="/blog" className="hover:text-orange-500 transition hover:underline underline-offset-4 px-2 py-1">Blog</Link>
            <Link to="/privacy-policy" className="hover:text-orange-500 transition hover:underline underline-offset-4 px-2 py-1">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-orange-500 transition hover:underline underline-offset-4 px-2 py-1">Terms of Service</Link>
            <Link to="/careers" className="hover:text-orange-500 transition hover:underline underline-offset-4 px-2 py-1">Careers</Link>
          </div>
          <p className="mt-4 sm:mt-0 text-center sm:text-right">© 2025 Estate Hive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
