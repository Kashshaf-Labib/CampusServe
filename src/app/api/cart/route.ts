import { NextResponse } from "next/server";
import Cart, { ICartItem } from "@/lib/models/Cart";
import { dbConnect } from "@/db/config";

export async function POST(req: Request) {
  await dbConnect();

  const { userId, foodItemId, quantity } = await req.json();

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the item already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item: ICartItem) => item.foodItem.toString() === foodItemId
    );

    if (itemIndex > -1) {
      // If item exists, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // If item does not exist, add it to the cart
      cart.items.push({ foodItem: foodItemId, quantity });
    }

    await cart.save();

    return NextResponse.json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { message: "Failed to add to cart" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.foodItem"
    );

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
