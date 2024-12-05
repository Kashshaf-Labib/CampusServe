import { NextResponse } from "next/server";
import { dbConnect } from "@/db/config";
import Review from "@/lib/models/Review";
import FoodItem from "@/lib/models/FoodItem";
import User from "@/lib/models/User";

// **POST**: Add a new review
export async function POST(req: Request) {
  try {
    const { foodItemId, userId, rating, comment } = await req.json();

    // Ensure database connection
    await dbConnect();
    // Validate inputs
    if (!foodItemId || !userId || !rating || !comment) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if the food item exists
    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return NextResponse.json(
        { error: "Food item not found." },
        { status: 404 }
      );
    }

    // Check if the user exists
    const user = await User.findOne({ userid: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Create a new review
    const review = await Review.create({
      foodItem: foodItemId,
      student: user._id,
      rating,
      comment,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Failed to add review." },
      { status: 500 }
    );
  }
}

// **GET**: Fetch reviews for a specific food item
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const foodItemId = searchParams.get("foodItemId");

    // Ensure database connection
    await dbConnect();
    if (!foodItemId) {
      return NextResponse.json(
        { error: "Food item ID is required." },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ foodItem: foodItemId }).populate(
      "student",
      "first_name last_name"
    );

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}
