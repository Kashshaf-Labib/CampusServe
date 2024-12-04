"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";

const links = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Menu", url: "/menu" },
  { id: 3, title: "Contact", url: "/contact" },
  { id: 4, title: "Cart", url: "/cart" },
  { id: 5, title: "Orders", url: "/orders" },
];

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <div className="relative">
      {/* Toggle Icon */}
      <div
        className="fixed top-4 right-4 z-[60] cursor-pointer p-2 bg-gray-800 rounded-full"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close Menu" : "Open Menu"}
      >
        <Image
          src={open ? "/CloseMenuIcon.png" : "/MenuIcon.png"}
          alt={open ? "Close Menu Icon" : "Menu Icon"}
          width={24}
          height={24}
        />
      </div>

      {/* Menu Overlay */}
      {open && (
        <motion.div
          className="bg-gray-900 fixed left-0 top-0 w-full h-screen flex flex-col items-center justify-center gap-8 text-white z-50"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Menu Links */}
          <motion.div
            className="flex flex-col items-center gap-6 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {links.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.1, color: "#F87171" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className="hover:text-red-500 transition duration-300"
                >
                  {item.title}
                </Link>
              </motion.div>
            ))}
            {!isSignedIn ? (
              <motion.div
                whileHover={{ scale: 1.1, color: "#F87171" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  <button className="bg-red-500 text-white py-3 px-6 rounded-md shadow-md hover:scale-105 transition-transform">
                    Login
                  </button>
                </Link>
              </motion.div>
            ) : (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-12 h-12",
                    userButtonPopoverCard: "w-72 h-auto",
                  },
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SideMenu;
