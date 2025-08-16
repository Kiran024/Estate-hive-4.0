import React, { useState } from "react";
import { motion } from "framer-motion";

const AuthToggleButton = ({ handleNavigation }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [hoverTab, setHoverTab] = useState(null);

  const handleClick = (tab) => {
    setActiveTab(tab);
    handleNavigation("/auth");
  };

  // Determine which tab to animate to
  const currentTab = hoverTab || activeTab;

  return (
    <div
      className="relative w-36 sm:w-40 h-10 bg-white rounded-full overflow-hidden flex items-center shadow-md"
      onMouseLeave={() => setHoverTab(null)} // Snap back on mouse leave
    >
      {/* Animated Sliding Background */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-[#1B1B59] rounded-full"
        animate={{ x: currentTab === "signup" ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      {/* Buttons */}
      <div className="relative z-10 flex w-full h-full text-sm font-medium select-none">
        <button
          onClick={() => handleClick("login")}
          onMouseEnter={() => setHoverTab("login")}
          className={`w-1/2 h-full flex items-center justify-center transition-colors duration-300 ${
            currentTab === "login" ? "text-white" : "text-[#1B1B59]"
          }`}
        >
          Login
        </button>

        <button
          onClick={() => handleClick("signup")}
          onMouseEnter={() => setHoverTab("signup")}
          className={`w-1/2 h-full flex items-center justify-center transition-colors duration-300 ${
            currentTab === "signup" ? "text-white" : "text-[#1B1B59]"
          }`}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default AuthToggleButton;
