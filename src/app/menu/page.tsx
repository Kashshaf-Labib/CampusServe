// "use client";

// import React, { useState } from "react";
// import Image from "next/image";

// const foodItems = [
//   {
//     id: 1,
//     name: "Paratha",
//     description: "Flaky and crispy Indian flatbread, perfect with curry.",
//     price: 20,
//     image: "/food_parotta.png",
//     reviews: [
//       { username: "John", rating: 4, comment: "Crispy and delicious!" },
//       { username: "Jane", rating: 5, comment: "Perfect with butter chicken." },
//     ],
//   },
//   {
//     id: 2,
//     name: "Chicken Tandoori",
//     description: "Spiced and roasted chicken, marinated in yogurt and spices.",
//     price: 250,
//     image: "/food_chickentandoori.png",
//     reviews: [],
//   },
//   {
//     id: 3,
//     name: "Fried Rice",
//     description: "Flavorful rice stir-fried with vegetables and egg.",
//     price: 150,
//     image: "/food_friedrice.png",
//     reviews: [],
//   },
// ];

// const CardItem = ({ food, onClick }: { food: typeof foodItems[0]; onClick: () => void }) => {
//   return (
//     <div
//       className="max-w-md mx-auto bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
//       onClick={onClick}
//     >
//       <div className="relative w-full h-60">
//         <Image
//           src={food.image}
//           alt={food.name}
//           layout="fill"
//           className="object-cover"
//           style={{ objectFit: "cover" }}
//         />
//       </div>
//       <div className="p-4 flex flex-col gap-2">
//         <h2 className="text-lg font-bold">{food.name}</h2>
//         <p className="text-sm text-gray-300">{food.description}</p>
//         <div className="flex justify-between items-center mt-2">
//           <span className="text-lg font-semibold">BDT {food.price}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MenuPage = () => {
//   const [selectedFood, setSelectedFood] = useState<typeof foodItems[0] | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [newReview, setNewReview] = useState({ username: "", rating: 0, comment: "" });

//   const handleCardClick = (food: typeof foodItems[0]) => {
//     setSelectedFood(food);
//     setQuantity(1); // Reset quantity when opening the modal
//     setNewReview({ username: "", rating: 0, comment: "" }); // Reset review form
//   };

//   const handleCloseModal = () => {
//     setSelectedFood(null);
//   };

//   const handleQuantityChange = (increment: boolean) => {
//     setQuantity((prev) => (increment ? prev + 1 : prev > 1 ? prev - 1 : 1));
//   };

//   const handleAddToCart = () => {
//     alert(`Added ${quantity} x ${selectedFood?.name} to cart!`);
//     setSelectedFood(null);
//   };

//   const handleReviewSubmit = () => {
//     if (selectedFood && newReview.username && newReview.rating && newReview.comment) {
//       const updatedFood = {
//         ...selectedFood,
//         reviews: [...selectedFood.reviews, newReview],
//       };
//       setSelectedFood(updatedFood);

//       const updatedFoodItems = foodItems.map((food) =>
//         food.id === updatedFood.id ? updatedFood : food
//       );
//       console.log(updatedFoodItems); // Update server or local state as required
//       alert("Review submitted successfully!");
//       setNewReview({ username: "", rating: 0, comment: "" });
//     } else {
//       alert("Please fill out all fields!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
//       <h1 className="text-3xl font-bold text-center mb-6 md:text-4xl">Our Menu</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {foodItems.map((food) => (
//           <CardItem key={food.id} food={food} onClick={() => handleCardClick(food)} />
//         ))}
//       </div>

//       {/* Modal */}
//       {selectedFood && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
//           <div className="bg-gray-800 text-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
//             >
//               ✕
//             </button>
//             <div className="relative w-full h-48 mb-4">
//               <Image
//                 src={selectedFood.image}
//                 alt={selectedFood.name}
//                 layout="fill"
//                 className="object-cover rounded-md"
//                 style={{ objectFit: "cover" }}
//               />
//             </div>
//             <h2 className="text-2xl font-bold mb-2">{selectedFood.name}</h2>
//             <p className="text-gray-300 mb-4">{selectedFood.description}</p>

//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => handleQuantityChange(false)}
//                   className="bg-gray-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600"
//                 >
//                   -
//                 </button>
//                 <span className="text-lg">{quantity}</span>
//                 <button
//                   onClick={() => handleQuantityChange(true)}
//                   className="bg-gray-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600"
//                 >
//                   +
//                 </button>
//               </div>
//               <span className="text-xl font-semibold">
//                 BDT {selectedFood.price * quantity}
//               </span>
//             </div>

//             <button
//               onClick={handleAddToCart}
//               className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition-colors mb-4"
//             >
//               Add to Cart
//             </button>

//             {/* Reviews Section */}
//             <h3 className="text-lg font-bold mb-2">Reviews</h3>
//             <div className="max-h-32 overflow-y-auto mb-4">
//               {selectedFood.reviews.length > 0 ? (
//                 selectedFood.reviews.map((review, index) => (
//                   <div key={index} className="mb-2">
//                     <p>
//                       <strong>{review.username}</strong> ({review.rating}/5):
//                     </p>
//                     <p className="text-gray-300">{review.comment}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No reviews yet.</p>
//               )}
//             </div>

//             {/* Add Review Form */}
//             <h3 className="text-lg font-bold mb-2">Leave a Review</h3>
//             <div className="flex flex-col gap-2">
//               <input
//                 type="text"
//                 placeholder="Your Name"
//                 value={newReview.username}
//                 onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
//                 className="bg-gray-700 text-white px-4 py-2 rounded-md"
//               />
//               <select
//                 value={newReview.rating}
//                 onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
//                 className="bg-gray-700 text-white px-4 py-2 rounded-md"
//               >
//                 <option value="0">Rating</option>
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                   <option key={rating} value={rating}>
//                     {rating} Star{rating > 1 ? "s" : ""}
//                   </option>
//                 ))}
//               </select>
//               <textarea
//                 placeholder="Your Comment"
//                 value={newReview.comment}
//                 onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                 className="bg-gray-700 text-white px-4 py-2 rounded-md"
//               />
//               <button
//                 onClick={handleReviewSubmit}
//                 className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
//               >
//                 Submit Review
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MenuPage;

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

interface Review {
  username: string;
  rating: number;
  comment: string;
}

interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  reviews: Review[];
}

const MenuPage = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({
    username: "",
    rating: 0,
    comment: "",
  });

  // Fetch menu items from the backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get("/api/menu"); // Adjust endpoint if necessary
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  const handleCardClick = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantity(1); // Reset quantity when opening the modal
    setNewReview({ username: "", rating: 0, comment: "" }); // Reset review form
  };

  const handleCloseModal = () => {
    setSelectedFood(null);
  };

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => (increment ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} x ${selectedFood?.name} to cart!`);
    setSelectedFood(null);
  };

  // Submit a new review
  const handleReviewSubmit = async () => {
    if (
      selectedFood &&
      newReview.username &&
      newReview.rating &&
      newReview.comment
    ) {
      try {
        const reviewData = {
          foodItemId: selectedFood._id,
          username: newReview.username,
          rating: newReview.rating,
          comment: newReview.comment,
        };
        await axios.post("/api/reviews", reviewData);

        // Update reviews in the UI
        const updatedFood = {
          ...selectedFood,
          reviews: [...selectedFood.reviews, newReview],
        };
        setSelectedFood(updatedFood);

        setFoodItems((prev) =>
          prev.map((food) =>
            food._id === updatedFood._id ? updatedFood : food
          )
        );

        alert("Review submitted successfully!");
        setNewReview({ username: "", rating: 0, comment: "" });
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review. Please try again.");
      }
    } else {
      alert("Please fill out all fields!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 md:text-4xl">
        Our Menu
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodItems.map((food) => (
          <div
            key={food._id}
            className="max-w-md mx-auto bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleCardClick(food)}
          >
            <div className="relative w-full h-60">
              <Image
                src={food.imageUrl}
                alt={food.name}
                layout="fill"
                className="object-cover"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-bold">{food.name}</h2>
              <p className="text-sm text-gray-300">{food.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-semibold">BDT {food.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
            <div className="relative w-full h-48 mb-4">
              <Image
                src={selectedFood.imageUrl}
                alt={selectedFood.name}
                layout="fill"
                className="object-cover rounded-md"
                style={{ objectFit: "cover" }}
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedFood.name}</h2>
            <p className="text-gray-300 mb-4">{selectedFood.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(false)}
                  className="bg-gray-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(true)}
                  className="bg-gray-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600"
                >
                  +
                </button>
              </div>
              <span className="text-xl font-semibold">
                BDT {selectedFood.price * quantity}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition-colors mb-4"
            >
              Add to Cart
            </button>

            {/* Reviews Section */}
            <h3 className="text-lg font-bold mb-2">Reviews</h3>
            <div className="max-h-32 overflow-y-auto mb-4">
              {selectedFood.reviews.length > 0 ? (
                selectedFood.reviews.map((review, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      <strong>{review.username}</strong> ({review.rating}/5):
                    </p>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>

            {/* Add Review Form */}
            <h3 className="text-lg font-bold mb-2">Leave a Review</h3>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.username}
                onChange={(e) =>
                  setNewReview({ ...newReview, username: e.target.value })
                }
                className="bg-gray-700 text-white px-4 py-2 rounded-md"
              />
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    rating: parseInt(e.target.value),
                  })
                }
                className="bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                <option value="0">Rating</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Your Comment"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                className="bg-gray-700 text-white px-4 py-2 rounded-md"
              />
              <button
                onClick={handleReviewSubmit}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
