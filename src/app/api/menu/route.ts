import { NextResponse } from "next/server";
import FoodItem from "@/lib/models/FoodItem";
import Review from "@/lib/models/Review";
import { dbConnect } from "@/db/config"; // Ensure this points to your database connection utility

// Connect to the database
dbConnect();

// GET: Fetch all food items with their reviews
export async function GET() {
  try {
    const foodItems = await FoodItem.find().lean(); // Fetch all food items
    const populatedFoodItems = await Promise.all(
      foodItems.map(async (foodItem) => {
        const reviews = await Review.find({ foodItem: foodItem._id }).populate(
          "student",
          "name"
        ); // Populate the "student" field in reviews
        return { ...foodItem, reviews };
      })
    );
    return NextResponse.json(populatedFoodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

// POST: Add a new food item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    // Validate required fields
    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newFoodItem = await FoodItem.create({
      name,
      description,
      price,
      imageUrl,
    });

    return NextResponse.json(newFoodItem, { status: 201 });
  } catch (error) {
    console.error("Error adding food item:", error);
    return NextResponse.json(
      { error: "Failed to add menu item" },
      { status: 500 }
    );
  }
}
