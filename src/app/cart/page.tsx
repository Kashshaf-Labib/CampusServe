"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<"cds" | "femaleHall">(
    "cds"
  );
  const [updatedQuantities, setUpdatedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [itemRemoved, setItemRemoved] = useState(false); // State to track item removal

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
          setItemRemoved(false); // Reset itemRemoved after fetching
        } catch (error) {
          console.error("Error fetching cart:", error);
          toast.error("Failed to fetch cart items.");
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    }
  }, [isSignedIn, user, updatedQuantities, itemRemoved]);

  // Calculate subtotal
  const subtotal =
    cart?.items.reduce(
      (total, item) => total + item.foodItem.price * item.quantity,
      0
    ) || 0;

  // Handle "Order Now" button click
  const handleOrderNow = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setShowOrderModal(true); // Show the order modal
  };

  // Confirm order placement
  const confirmOrder = async () => {
    try {
      const orderData = {
        userId: user?.id,
        foodItems: cart?.items,
        totalAmount: subtotal,
        toBeDelivered: deliveryOption === "femaleHall",
        paid: false, // payment is handled separately
      };

      await axios.post("/api/orders", orderData);
      await axios.delete(`/api/cart?userId=${user?.id}`); //clear the cart

      toast.success("Order placed successfully!");
      setCart(null);
      setShowOrderModal(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  // Update item quantity
  const updateQuantity = async (foodItemId: string) => {
    const newQuantity = updatedQuantities[foodItemId];
    if (newQuantity === undefined || newQuantity <= 0) {
      toast.error("Invalid quantity.");
      return;
    }

    try {
      const { data } = await axios.patch("/api/cart", {
        userId: user?.id,
        foodItemId,
        quantity: newQuantity,
      });
      setCart(data.cart); // Update the cart in the frontend
      setUpdatedQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[foodItemId]; // Remove the updated quantity from the state
        return newQuantities;
      });
      toast.success("Cart updated successfully!");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart.");
    }
  };

  // Remove item from cart
  const removeItem = async (foodItemId: string) => {
    try {
      const { data } = await axios.delete("/api/cart/item", {
        data: { userId: user?.id, foodItemId },
      });
      setCart(data.cart); // Update the cart in the frontend
      setItemRemoved(true); // Set itemRemoved to true
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  // Handle quantity change
  const handleQuantityChange = (foodItemId: string, quantity: number) => {
    setUpdatedQuantities((prev) => ({
      ...prev,
      [foodItemId]: quantity,
    }));
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
                <div className="flex items-center gap-4">
                  {/* <input
                    type="number"
                    value={
                      updatedQuantities[item.foodItem._id] || item.quantity
                    }
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(item.foodItem._id, +e.target.value)
                    }
                    className="w-16 bg-gray-700 text-white px-2 py-1 rounded-md"
                  /> */}
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.foodItem._id,
                        (updatedQuantities[item.foodItem._id] ||
                          item.quantity) - 1
                      )
                    }
                    className="text-2xl hover:text-red-600"
                    disabled={
                      (updatedQuantities[item.foodItem._id] || item.quantity) <=
                      1
                    }
                  >
                    -
                  </button>
                  <span className="w-8 text-center">
                    {updatedQuantities[item.foodItem._id] || item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.foodItem._id,
                        (updatedQuantities[item.foodItem._id] ||
                          item.quantity) + 1
                      )
                    }
                    className="text-2xl hover:text-green-600"
                  >
                    +
                  </button>
                  {updatedQuantities[item.foodItem._id] !== undefined && (
                    <button
                      onClick={() => updateQuantity(item.foodItem._id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => removeItem(item.foodItem._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
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

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Choose Delivery Option</h2>
            <div className="space-y-4">
              {cart?.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.foodItem.imageUrl}
                      alt={item.foodItem.name}
                      className="w-12 h-12 object-cover rounded-md"
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
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <label className="flex items-center gap-4">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="cds"
                  checked={deliveryOption === "cds"}
                  onChange={() => setDeliveryOption("cds")}
                  className="form-radio h-5 w-5 text-blue-500"
                />
                <span>Serve at CDS</span>
              </label>
              <label className="flex items-center gap-4">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="femaleHall"
                  checked={deliveryOption === "femaleHall"}
                  onChange={() => setDeliveryOption("femaleHall")}
                  className="form-radio h-5 w-5 text-blue-500"
                />
                <span>Deliver to Female Hall of Residence</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowOrderModal(false)}
                className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buttons for "View Orders" and "Go to Menu" */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => router.push("/orders")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          View Orders
        </button>
        <button
          onClick={() => router.push("/menu")}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Go to Menu
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CartPage;
