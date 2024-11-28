// "use-client"
// import { motion } from "framer-motion";
// import { FaUtensils, FaBell, FaHome, FaTicketAlt } from "react-icons/fa";

// export default function FeatureHighlights() {
//   const features = [
//     {
//       name: "Food Ordering & Process Automation",
//       description: "Seamlessly order food and enjoy automated service management for a hassle-free experience.",
//       icon: <FaUtensils className="text-red-500 text-5xl" />,
//     },
//     {
//       name: "Dorm-Specific Delivery",
//       description: "Get your meals delivered right to your dorm with precision and convenience.",
//       icon: <FaHome className="text-green-500 text-5xl" />,
//     },
//     {
//       name: "Real-Time Notifications",
//       description: "Stay updated with order statuses, delivery alerts, and campus food-related announcements.",
//       icon: <FaBell className="text-yellow-500 text-5xl" />,
//     },
//     {
//       name: "Token-Based Food Serving",
//       description: "Efficient token-based system ensures quick and organized meal distribution.",
//       icon: <FaTicketAlt className="text-blue-500 text-5xl" />,
//     },
//   ];

//   return (
//     <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Heading */}
//         <motion.h2
//           className="text-4xl font-bold text-center text-white mb-12"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           What CampusServe Offers
//         </motion.h2>

//         {/* Feature Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               className="p-6 bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
//               whileHover={{ scale: 1.05 }}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: index * 0.2 }}
//             >
//               {/* Icon */}
//               <div className="mb-4">{feature.icon}</div>

//               {/* Feature Name */}
//               <h3 className="text-lg font-bold text-white mb-2">{feature.name}</h3>

//               {/* Description */}
//               <p className="text-sm text-gray-400">{feature.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Background Effects */}
//       <motion.div
//         className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-pink-500 to-red-500 rounded-full blur-3xl opacity-40"
//         initial={{ opacity: 0, scale: 0.5 }}
//         animate={{ opacity: 0.4, scale: 1.2 }}
//         transition={{ duration: 1.5, ease: "easeInOut" }}
//       />
//       <motion.div
//         className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500 to-green-500 rounded-full blur-3xl opacity-40"
//         initial={{ opacity: 0, scale: 0.5 }}
//         animate={{ opacity: 0.4, scale: 1.2 }}
//         transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
//       />
//     </div>
//   );
// }


"use client";
import { FaUtensils, FaBell, FaHome, FaTicketAlt } from "react-icons/fa";

export default function FeatureHighlights() {
  const features = [
    {
      name: "Food Ordering & Process Automation",
      description: "Seamlessly order food and enjoy automated service management for a hassle-free experience.",
      icon: <FaUtensils className="text-red-500 text-5xl" />,
    },
    {
      name: "Dorm-Specific Delivery",
      description: "Get your meals delivered right to your dorm with precision and convenience.",
      icon: <FaHome className="text-green-500 text-5xl" />,
    },
    {
      name: "Real-Time Notifications",
      description: "Stay updated with order statuses, delivery alerts, and campus food-related announcements.",
      icon: <FaBell className="text-yellow-500 text-5xl" />,
    },
    {
      name: "Token-Based Food Serving",
      description: "Efficient token-based system ensures quick and organized meal distribution.",
      icon: <FaTicketAlt className="text-blue-500 text-5xl" />,
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-white mb-12 animate-fade-in">
          What CampusServe Offers
        </h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center animate-slide-in delay-${index}`}
            >
              {/* Icon */}
              <div className="mb-4">{feature.icon}</div>

              {/* Feature Name */}
              <h3 className="text-lg font-bold text-white mb-2">{feature.name}</h3>

              {/* Description */}
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Effects */}
      {/* <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-pink-500 to-red-500 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500 to-green-500 rounded-full blur-3xl opacity-40 animate-pulse" /> */}
    </div>
  );
}
