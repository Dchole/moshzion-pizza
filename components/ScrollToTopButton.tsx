"use client";

import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-50 bg-primary hover:bg-brown-medium text-brown-dark p-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Scroll to top"
    >
      <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />
    </button>
  );
}
