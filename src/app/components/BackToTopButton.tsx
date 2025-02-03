"use client";
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-8 bottom-8 p-3 bg-white text-indigo-500 rounded-full shadow-lg
                 border border-indigo-100 hover:bg-indigo-50 transition-all duration-300 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                 ${
                   isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-12 pointer-events-none"
                 }
                 z-50`}
      aria-label="Back to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default BackToTopButton;
