"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { SignedIn, useUser } from "@clerk/nextjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comment from "@/components/Comment";

interface IReview {
  _id: string;
  user: {
    first_name: string;
    last_name: string;
  };
  rating?: number;
  comment: string;
  replies: IReview[];
  parentReview?: string;
  createdAt: Date;
}

interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const MenuPage = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [selectedTab, setSelectedTab] = useState("reviews");
  const [reviews, setReviews] = useState<IReview[]>([]);

  const { user } = useUser();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get("/api/menu");
        setFoodItems(data);
      } catch (error) {
        toast.error("Failed to fetch menu.");
      }
    };
    fetchMenu();
  }, []);

  const fetchReviews = async (foodItemId: string) => {
    try {
      const { data } = await axios.get(`/api/reviews?foodItemId=${foodItemId}`);
      setReviews(data);
    } catch (error) {
      toast.error("Failed to load reviews.");
    }
  };

  const handleCardClick = async (food: FoodItem) => {
    try {
      setSelectedFood(food);
      setQuantity(1);
      setNewReview({ rating: 5, comment: "" });
      await fetchReviews(food._id);
    } catch (error) {
      toast.error("Failed to load food details.");
    }
  };

  const handleCloseModal = () => {
    setSelectedFood(null);
    setReviews([]);
  };

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => (increment ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (selectedFood && user) {
      try {
        await axios.post("/api/cart", {
          userId: user.id,
          foodItemId: selectedFood._id,
          quantity: quantity,
        });
        toast.success(`Added ${quantity} x ${selectedFood.name} to cart!`);
        setSelectedFood(null);
      } catch (error) {
        toast.error("Failed to add to cart.");
      }
    } else {
      toast.error("Please log in to add items to your cart.");
    }
  };

  const handleReviewSubmit = async () => {
    if (selectedFood && user && newReview.rating && newReview.comment) {
      try {
        await axios.post("/api/reviews", {
          foodItemId: selectedFood._id,
          userId: user.id,
          rating: newReview.rating,
          comment: newReview.comment,
        });

        toast.success("Review submitted successfully!");
        setNewReview({ rating: 5, comment: "" });
        await fetchReviews(selectedFood._id);
      } catch (error) {
        toast.error("Failed to submit review.");
      }
    } else {
      toast.error("Please fill out all fields!");
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

            <h3 className="text-lg font-bold mb-4">Reviews</h3>
            <div className="flex flex-col items-start">
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

              <div className="w-full">
                {selectedTab === "reviews" && (
                  <div className="max-h-64 overflow-y-auto mb-4 space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <Comment
                          key={review._id}
                          comment={review}
                          depth={0}
                          onReply={() => fetchReviews(selectedFood._id)}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No reviews yet.</p>
                    )}
                  </div>
                )}

                {selectedTab === "addReview" && (
                  <SignedIn>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={newReview.rating}
                          onChange={(e) =>
                            setNewReview((prev) => ({
                              ...prev,
                              rating: Number(e.target.value),
                            }))
                          }
                          className="bg-gray-700 text-white p-2 rounded"
                        >
                          {[5, 4, 3, 2, 1].map((num) => (
                            <option key={num} value={num}>
                              {num} Stars
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        placeholder="Write your review..."
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white"
                        rows={4}
                      />
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
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default MenuPage;
