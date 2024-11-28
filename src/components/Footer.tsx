"use client"
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
      className="h-16 md:h-20 p-6 lg:px-20 xl:px-40 flex flex-col md:flex-row items-center justify-between bg-gray-900 text-white border-t-[1px] border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* LOGO */}
      <motion.div
        className="text-lg md:text-xl font-bold mb-4 md:mb-0 hover:text-red-500 transition duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/">Campus Serve</Link>
      </motion.div>

      {/* SOCIAL ICONS */}
      <div className="flex gap-4 mb-4 md:mb-0">
        <motion.a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <i className="fab fa-facebook-f"></i>
        </motion.a>
        <motion.a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <i className="fab fa-twitter"></i>
        </motion.a>
        <motion.a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <i className="fab fa-instagram"></i>
        </motion.a>
        <motion.a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <i className="fab fa-linkedin-in"></i>
        </motion.a>
      </div>

      {/* COPYRIGHT */}
      <p className="text-sm md:text-base text-gray-400 text-center md:text-right">
        © {new Date().getFullYear()} ALL RIGHTS RESERVED.
      </p>
    </motion.div>
  );
};

export default Footer;

