// "use client";

// import React, { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface FoodItem {
//   _id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
// }

// interface OrderItem {
//   foodItem: FoodItem;
//   quantity: number;
// }

// interface Order {
//   _id: string;
//   token: string;
//   status: "pending" | "completed" | "cancelled" | "delivered";
//   foodItems: OrderItem[];
//   totalAmount: number;
//   createdAt: string;
//   toBeDelivered: boolean;
// }

// const OrdersPage = () => {
//   const { user } = useUser();
//   const [activeTab, setActiveTab] = useState<"pending" | "previous">("pending");
//   const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
//   const [previousOrders, setPreviousOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user?.id) return;

//       try {
//         // Fetch pending orders
//         const pendingResponse = await axios.get("/api/orders", {
//           params: { status: "pending", userId: user.id },
//         });
//         setPendingOrders(pendingResponse.data);

//         // Fetch previous orders
//         const previousResponse = await axios.get("/api/orders", {
//           params: { status: "previous", userId: user.id },
//         });
//         setPreviousOrders(previousResponse.data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [user?.id]);

//   const cancelOrder = async (orderId: string) => {
//     try {
//       if (!user?.id) return;
//       setLoading(true);
//       const { data: cancelledOrder } = await axios.patch(
//         `/api/orders?userId=${user.id}`,
//         {
//           orderId,
//         }
//       );

//       setPendingOrders((prev) =>
//         prev.map((order) =>
//           order._id === cancelledOrder._id ? cancelledOrder : order
//         )
//       );

//       toast.success("Order cancelled successfully!");
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//       toast.error("Failed to cancel order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const baseStyle = "px-2 py-1 rounded-full text-sm";
//     switch (status) {
//       case "pending":
//         return `${baseStyle} bg-yellow-500/20 text-yellow-500`;
//       case "delivered":
//         return `${baseStyle} bg-green-500/20 text-green-500`;
//       case "completed":
//         return `${baseStyle} bg-blue-500/20 text-blue-500`;
//       case "cancelled":
//         return `${baseStyle} bg-red-500/20 text-red-500`;
//       default:
//         return `${baseStyle} bg-gray-500/20 text-gray-500`;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-8 border-b border-gray-700">
//         <button
//           className={`pb-2 px-4 ${
//             activeTab === "pending" ? "border-b-2 border-blue-500" : ""
//           }`}
//           onClick={() => setActiveTab("pending")}
//         >
//           Pending Orders
//         </button>
//         <button
//           className={`pb-2 px-4 ${
//             activeTab === "previous" ? "border-b-2 border-blue-500" : ""
//           }`}
//           onClick={() => setActiveTab("previous")}
//         >
//           Order History
//         </button>
//       </div>

//       {/* Orders List */}
//       {loading ? (
//         <div className="text-center py-8">Loading orders...</div>
//       ) : (
//         <div className="space-y-6">
//           {(activeTab === "pending" ? pendingOrders : previousOrders).map(
//             (order) => (
//               <div
//                 key={order._id}
//                 className="bg-gray-800 rounded-lg p-6 shadow-lg"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-xl font-semibold">
//                       Order #{order.token}
//                     </h3>
//                     <p className="text-gray-400 text-sm">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <span className={getStatusBadge(order.status)}>
//                     {order.status}
//                   </span>
//                 </div>

//                 <div className="mb-4">
//                   <h4 className="font-semibold mb-2">Items:</h4>
//                   <div className="space-y-2">
//                     {order.foodItems.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between"
//                       >
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={item.foodItem.imageUrl}
//                             alt={item.foodItem.name}
//                             className="w-12 h-12 rounded-md object-cover"
//                           />
//                           <span>{item.foodItem.name}</span>
//                         </div>
//                         <span>
//                           {item.quantity} x BDT {item.foodItem.price}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center border-t border-gray-700 pt-4">
//                   <div>
//                     {order.toBeDelivered && (
//                       <p className="text-sm text-blue-400">
//                         Delivery to Female Hall
//                       </p>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <p className="text-gray-400 text-sm">Total</p>
//                     <p className="text-xl font-bold">BDT {order.totalAmount}</p>
//                   </div>
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading &&
//         (activeTab === "pending" ? pendingOrders : previousOrders).length ===
//           0 && (
//           <div className="text-center py-12 text-gray-400">
//             No {activeTab === "pending" ? "pending" : "previous"} orders found
//           </div>
//         )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default OrdersPage;


"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface OrderItem {
  foodItem: FoodItem;
  quantity: number;
}

interface Order {
  _id: string;
  token: string;
  status: "pending" | "completed" | "cancelled" | "delivered";
  foodItems: OrderItem[];
  totalAmount: number;
  createdAt: string;
  toBeDelivered: boolean;
}

const OrdersPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"pending" | "previous">("pending");
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [previousOrders, setPreviousOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const [pendingRes, previousRes] = await Promise.all([
          axios.get("/api/orders", { params: { status: "pending", userId: user.id } }),
          axios.get("/api/orders", { params: { status: "previous", userId: user.id } })
        ]);

        setPendingOrders(pendingRes.data);
        setPreviousOrders(previousRes.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const cancelOrder = async (orderId: string) => {
    if (!user?.id) return;
    
    try {
      setCancellingId(orderId);
      await axios.patch(`/api/orders?userId=${user.id}`, { orderId });
      
      // Refresh orders after cancellation
      const [pendingRes, previousRes] = await Promise.all([
        axios.get("/api/orders", { params: { status: "pending", userId: user.id } }),
        axios.get("/api/orders", { params: { status: "previous", userId: user.id } })
      ]);

      setPendingOrders(pendingRes.data);
      setPreviousOrders(previousRes.data);
      toast.success("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-2 py-1 rounded-full text-sm";
    switch (status) {
      case "pending":
        return `${baseStyle} bg-yellow-500/20 text-yellow-500`;
      case "delivered":
        return `${baseStyle} bg-green-500/20 text-green-500`;
      case "completed":
        return `${baseStyle} bg-blue-500/20 text-blue-500`;
      case "cancelled":
        return `${baseStyle} bg-red-500/20 text-red-500`;
      default:
        return `${baseStyle} bg-gray-500/20 text-gray-500`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        <button
          className={`pb-2 px-4 ${
            activeTab === "pending" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Orders
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === "previous" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("previous")}
        >
          Order History
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : (
        <div className="space-y-6">
          {(activeTab === "pending" ? pendingOrders : previousOrders).map(
            (order) => (
              <div
                key={order._id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Order #{order.token}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={getStatusBadge(order.status)}>
                      {order.status}
                    </span>
                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className={`text-red-500 hover:text-red-600 text-sm ${
                          cancellingId === order._id ? "opacity-50" : ""
                        }`}
                        disabled={cancellingId === order._id}
                      >
                        {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.foodItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.foodItem.imageUrl}
                            alt={item.foodItem.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <span>{item.foodItem.name}</span>
                        </div>
                        <span>
                          {item.quantity} x BDT {item.foodItem.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                  <div>
                    {order.toBeDelivered && (
                      <p className="text-sm text-blue-400">
                        Delivery to Female Hall
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-xl font-bold">BDT {order.totalAmount}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        (activeTab === "pending" ? pendingOrders : previousOrders).length ===
          0 && (
          <div className="text-center py-12 text-gray-400">
            No {activeTab === "pending" ? "pending" : "previous"} orders found
          </div>
        )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default OrdersPage;