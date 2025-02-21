import { NextResponse } from "next/server";
import Cart, { ICartItem } from "@/lib/models/Cart";
import { dbConnect } from "@/db/config";

// DELETE route to remove an item from the cart
export async function DELETE(req: Request) {
  await dbConnect();

  const { userId, foodItemId } = await req.json();

  if (!userId || !foodItemId) {
    return NextResponse.json(
      { message: "User ID and Food Item ID are required" },
      { status: 400 }
    );
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item: ICartItem) => item.foodItem.toString() !== foodItemId
    );

    await cart.save();

    return NextResponse.json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { message: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
