import { NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import Cart from "@/lib/models/Cart";
import { dbConnect } from "@/db/config";

// Token generation function
const generateOrderToken = () => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORDER-${timestamp}-${random}`;
};

export async function POST(req: Request) {
  await dbConnect();

  const { userId, foodItems, totalAmount, toBeDelivered, paid } =
    await req.json();

  try {
    // Create the order
    const order = new Order({
      user: userId,
      foodItems,
      totalAmount,
      toBeDelivered,
      paid,
      status: "pending", // Default status
      token: generateOrderToken(),
    });

    await order.save();

    // Delete the user's cart
    await Cart.findOneAndDelete({ user: userId });

    return NextResponse.json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { message: "Failed to place order" },
      { status: 500 }
    );
  }
}

// Get pending orders
export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const userId = searchParams.get("userId");

    // For pending orders
    if (statusFilter === "pending") {
      const orders = await Order.find({
        user: userId,
        status: "pending",
      }).populate("foodItems.foodItem");

      return NextResponse.json(orders);
    }

    // For previous orders (completed/delivered)
    const orders = await Order.find({
      user: userId,
      status: { $in: ["completed", "delivered"] },
    }).populate("foodItems.foodItem");

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Cancel order
export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { orderId } = await req.json();

    if (!userId || !orderId) {
      return NextResponse.json(
        { error: "Missing user ID or order ID" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        user: userId,
        status: "pending",
      },
      { status: "cancelled" },
      { new: true }
    ).populate("foodItems.foodItem");

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found or cannot be cancelled" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
