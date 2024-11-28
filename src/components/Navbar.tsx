"use client";
import Link from "next/link";
import SideMenu from "./SideMenu";
import { motion } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";
const Navbar = () => {
  const {isSignedIn} = useAuth();
  return (
    <motion.div
      className="h-16 p-4 flex items-center justify-between border-b-[1px] border-gray-700 bg-gray-900 text-white md:h-20 lg:px-20 xl:px-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-6 flex-1 items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="hover:text-red-500 transition duration-300"
        >
          <Link href="/">Home</Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="hover:text-red-500 transition duration-300"
        >
          <Link href="/menu">Menu</Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="hover:text-red-500 transition duration-300"
        >
          <Link href="/contact">Contact</Link>
        </motion.div>
      </div>

      {/* LOGO */}
      <div className="text-2xl font-bold flex-1 md:text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="hover:text-red-500 transition duration-300"
        >
          <Link href="/">Campus Serve</Link>
        </motion.div>
      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <SideMenu />
      </div>

      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-6 items-center justify-end flex-1">
        {!isSignedIn ? (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="transition duration-100"
          >
            <Link href="/sign-in">
              <button className="bg-red-500 text-white py-2 px-6 rounded-md shadow-md hover:scale-105 transition-transform">
                Login
              </button>
            </Link>
          </motion.div>
        ) : (
          // <motion.div
          //   whileHover={{ scale: 1.1 }}
          //   whileTap={{ scale: 0.95 }}
          //   className="hover:text-red-500 transition duration-300"
          // >
          //   <Link href="/orders">Orders</Link>
          // </motion.div>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9",
              },
            }}
          />
        )}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="hover:text-red-500 transition duration-300"
        >
          <Link href="/cart">Cart</Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Navbar;
