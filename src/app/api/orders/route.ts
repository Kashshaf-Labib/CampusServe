import { NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import Cart from "@/lib/models/Cart";
import { dbConnect } from "@/db/config";

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
