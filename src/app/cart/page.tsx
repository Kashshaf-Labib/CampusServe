"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ICartItem {
  foodItem: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
}

const CartPage = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if user is not signed in
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in"); // Redirect to login page
    }
  }, [isSignedIn, router]);

  // Fetch cart items for the logged-in user
  useEffect(() => {
    if (isSignedIn && user) {
      const fetchCart = async () => {
        try {
          const { data } = await axios.get("/api/cart", {
            params: { userId: user.id },
          });
          setCart(data);
        } catch (error) {
          console.error("Error fetching cart:", error);
          toast.error("Failed to fetch cart items.");
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    }
  }, [isSignedIn, user]);

  // Calculate subtotal
  const subtotal =
    cart?.items.reduce(
      (total, item) => total + item.foodItem.price * item.quantity,
      0
    ) || 0;

  // Handle "Order Now" button click
  const handleOrderNow = () => {
    toast.success("Order placed successfully!");
    // Add logic to handle the order placement
  };

  if (!isSignedIn) {
    return null; // Redirecting to login, so no need to render anything
  }

  if (loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
      {cart?.items.length === 0 ? (
        <p className="text-center text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {cart?.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.foodItem.imageUrl}
                    alt={item.foodItem.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.foodItem.name}
                    </h3>
                    <p className="text-gray-400">
                      BDT {item.foodItem.price} x {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold">
                  BDT {item.foodItem.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Subtotal</h3>
              <p className="text-xl font-bold">BDT {subtotal}</p>
            </div>
            <button
              onClick={handleOrderNow}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-md mt-6 hover:bg-red-600 transition-colors"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CartPage;
