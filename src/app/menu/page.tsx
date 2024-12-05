"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { SignedIn, useUser } from "@clerk/nextjs";

interface Review {
  student: {
    first_name: string;
    last_name: string;
  };
  //username: string;
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
    rating: 0,
    comment: "",
  });

  const [selectedTab, setSelectedTab] = useState("reviews");

  const { user } = useUser(); // Fetch user details from Clerk

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get("/api/menu");
        setFoodItems(data);
      } catch (error) {
        console.log("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  const handleCardClick = async (food: FoodItem) => {
    try {
      const { data: reviews } = await axios.get(
        `/api/reviews?foodItemId=${food._id}`
      );
      const updatedFood = { ...food, reviews };
      setSelectedFood(updatedFood);
      setQuantity(1); // Reset quantity
      setNewReview({ rating: 0, comment: "" }); // Reset review form
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("Failed to load reviews.");
    }
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

  const handleReviewSubmit = async () => {
    if (selectedFood && user && newReview.rating && newReview.comment) {
      try {
        const reviewData = {
          foodItemId: selectedFood._id,
          userId: user.id, // Use Clerk's user ID
          rating: newReview.rating,
          comment: newReview.comment,
        };

        // Post the review to the server
        await axios.post("/api/reviews", reviewData);

        // Update local state
        const updatedFood: FoodItem = {
          ...selectedFood,
          reviews: [
            ...selectedFood.reviews,
            {
              student: {
                first_name: user.firstName || "Anonymous",
                last_name: user.lastName || "",
              },
              rating: newReview.rating,
              comment: newReview.comment,
            },
          ],
        };

        setSelectedFood(updatedFood);

        setFoodItems((prev) =>
          prev.map((food) =>
            food._id === updatedFood._id ? updatedFood : food
          )
        );

        alert("Review submitted successfully!");
        setNewReview({ rating: 0, comment: "" });
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review. Please try again.");
      }
    } else {
      alert("Please log in and fill out all fields!");
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
            {/* Reviews Section */}
            <h3 className="text-lg font-bold mb-4">Reviews</h3>
            <div className="flex flex-col items-start">
              {/* Tabs for switching between "Reviews" and "Add Review" */}
              <div className="flex w-full mb-4 border-b border-gray-600">
                <button
                  className={`px-4 py-2 text-sm ${
                    selectedTab === "reviews"
                      ? "text-white border-b-2 border-blue-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => setSelectedTab("reviews")}
                >
                  Reviews
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    selectedTab === "addReview"
                      ? "text-white border-b-2 border-blue-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => setSelectedTab("addReview")}
                >
                  Add Your Review
                </button>
              </div>

              {/* Tab Content */}
              <div className="w-full">
                {selectedTab === "reviews" && (
                  <div className="max-h-32 overflow-y-auto mb-4">
                    {selectedFood.reviews.length > 0 ? (
                      selectedFood.reviews.map((review, index) => (
                        <div key={index} className="mb-2">
                          <p className="text-sm">
                            <strong className="text-white">
                              {review.student?.first_name}{" "}
                              {review.student?.last_name}
                            </strong>{" "}
                            <span className="text-yellow-400">
                              ({review.rating}/5)
                            </span>
                          </p>
                          <p className="text-gray-300 text-sm">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No reviews yet.</p>
                    )}
                  </div>
                )}

                {selectedTab === "addReview" && (
                  <SignedIn>
                    <div className="flex flex-col gap-4">
                      <input
                        type="number"
                        value={newReview.rating}
                        min="1"
                        max="5"
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            rating: +e.target.value,
                          }))
                        }
                        placeholder="Rating (1-5)"
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white"
                      />
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        placeholder="Write your comment"
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white"
                      ></textarea>
                      <button
                        onClick={handleReviewSubmit}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600"
                      >
                        Submit Review
                      </button>
                    </div>
                  </SignedIn>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
