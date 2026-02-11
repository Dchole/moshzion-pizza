"use client";

import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconButton } from "@/components/ui/IconButton";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 1530);
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

  return (
    <div
      className={`fixed bottom-16 right-8 z-50 transition-all duration-200 ${
        isVisible
          ? "scale-100 opacity-100 pointer-events-auto"
          : "scale-0 opacity-0 pointer-events-none"
      }`}
    >
      <IconButton
        onClick={scrollToTop}
        icon={<KeyboardArrowUpIcon sx={{ fontSize: 24 }} />}
        aria-label="Scroll to top"
        variant="filled"
        color="beige"
        size="lg"
        className="rounded-md! shadow-lg hover:bg-brown-medium transition-all hover:scale-110"
      />
    </div>
  );
}
