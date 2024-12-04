"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Slide data with titles and image paths
const slides = [
  {
    title: "IT'S TIME TO TAKE A BREAK",
    image: "/food_parotta.png",
  },
  {
    title: "ENJOY THE HOT SERVED FOOD EXPERIENCE",
    image: "/food_friedrice.png",
  },
  {
    title: "AND BLAST YOUR TASTEBUD WITH FLAVORS",
    image: "/food_chickentandoori.png",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically change slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length); // Cycle through slides
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row bg-gray-900">
      {/* TEXT CONTAINER */}
      <div className="flex-1 flex items-center justify-center flex-col gap-8 text-white font-bold z-10">
        <motion.h1
          key={slides[currentSlide].title}
          className="text-4xl text-center uppercase p-4 md:p-10 md:text-5xl xl:text-6xl transition duration-100"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          {slides[currentSlide].title}
        </motion.h1>
        <motion.button
          className="bg-red-500 text-white py-3 px-6 rounded-md shadow-md hover:scale-105 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Order Now
        </motion.button>
      </div>

      {/* IMAGE CONTAINER */}
      <motion.div
        className="relative w-full flex-1 overflow-hidden"
        key={slides[currentSlide].image}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Image
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          fill
          className="object-cover"
        />

        {/* Subtle Fade Overlay for Large Screens */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent hidden lg:block"
          style={{ opacity: 0.7 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Subtle Fade Overlay for Small Screens */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-transparent lg:hidden"
          style={{ opacity: 0.7 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;

