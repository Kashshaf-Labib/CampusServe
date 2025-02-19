
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
    </div>
  );
}
