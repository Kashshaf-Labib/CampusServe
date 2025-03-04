"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [reportContent, setReportContent] = useState<Order[]>([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const [pendingRes, previousRes] = await Promise.all([
          axios.get("/api/orders", {
            params: { status: "pending", userId: user.id },
          }),
          axios.get("/api/orders", {
            params: { status: "previous", userId: user.id },
          }),
        ]);

        setPendingOrders(pendingRes.data);
        setPreviousOrders(previousRes.data);
        setReportContent(
          filterOrdersByPeriod(previousRes.data, selectedPeriod)
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  useEffect(() => {
    if (previousOrders.length > 0) {
      setReportContent(filterOrdersByPeriod(previousOrders, selectedPeriod));
    }
  }, [selectedPeriod, previousOrders]);

  const filterOrdersByPeriod = (orders: Order[], days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return orders.filter((order) => new Date(order.createdAt) >= cutoffDate);
  };

  const cancelOrder = async (orderId: string) => {
    if (!user?.id) return;

    try {
      setCancellingId(orderId);
      await axios.patch(`/api/orders?userId=${user.id}`, { orderId });

      const [pendingRes, previousRes] = await Promise.all([
        axios.get("/api/orders", {
          params: { status: "pending", userId: user.id },
        }),
        axios.get("/api/orders", {
          params: { status: "previous", userId: user.id },
        }),
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

  const generatePDFReport = async () => {
    if (reportContent.length === 0) {
      toast.error("No orders found in the selected period");
      return;
    }

    setGeneratingPDF(true);

    try {
      // Create a temporary visible container for rendering
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.innerHTML =
        document.getElementById("report-content")?.innerHTML || "";
      document.body.appendChild(tempDiv);

      // Add small delay to ensure rendering
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(tempDiv, {
        logging: true,
        useCORS: true,
        scale: 2, // Increase resolution
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`order-report-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Report generated successfully!");

      // Clean up temporary element
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report");
    } finally {
      setGeneratingPDF(false);
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

      {/* Report Controls */}
      {activeTab === "previous" && (
        <div className="flex gap-4 mb-6 items-center">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
          >
            <option value={7}>Last 1 Week</option>
            <option value={14}>Last 2 Weeks</option>
            <option value={30}>Last 1 Month</option>
          </select>

          <button
            onClick={generatePDFReport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            disabled={reportContent.length === 0 || generatingPDF}
          >
            {generatingPDF ? "Generating Report..." : "Generate PDF Report"}
          </button>
        </div>
      )}

      {/* Hidden PDF Content */}
      <div id="report-content" className="hidden">
        <div className="p-8 bg-white text-black">
          <h1 className="text-2xl font-bold mb-4">Order History Report</h1>
          <div className="mb-4 flex justify-between">
            <p>Period: {selectedPeriod} days</p>
            <p>Generated: {new Date().toLocaleDateString()}</p>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Order Date</th>
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Items</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportContent.map((order) => (
                <tr key={order._id} className="border">
                  <td className="p-2 border text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center">{order.token}</td>
                  <td className="p-2 border">
                    <ul className="list-disc pl-4">
                      {order.foodItems.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.foodItem.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 border text-center">
                    BDT {order.totalAmount}
                  </td>
                  <td className="p-2 border text-center capitalize">
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 pt-4 border-t">
            <p className="font-bold">Total Orders: {reportContent.length}</p>
            <p className="font-bold">
              Grand Total: BDT{" "}
              {reportContent.reduce((sum, order) => sum + order.totalAmount, 0)}
            </p>
          </div>
        </div>
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
                        {cancellingId === order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
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
