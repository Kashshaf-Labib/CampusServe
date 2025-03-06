import { NextResponse } from "next/server";
import { dbConnect } from "@/db/config";
import Review from "@/lib/models/Review";
import User from "@/lib/models/User";

// Helper to recursively populate replies
async function populateReplies(reviews: any[]): Promise<any[]> {
  return Promise.all(
    reviews.map(async (review) => ({
      ...review.toObject(),
      replies: await populateReplies(
        await Review.find({ parentReview: review._id })
          .populate("user", "first_name last_name")
          .exec()
      )
    }))
  );
}

export async function POST(req: Request) {
  try {
    const { foodItemId, userId, rating, comment, parentReviewId } = await req.json();
    await dbConnect();

    // Validation
    if (!foodItemId || !userId || !comment) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // Check if parent review exists
    if (parentReviewId) {
      const parentReview = await Review.findById(parentReviewId);
      if (!parentReview) {
        return NextResponse.json(
          { error: "Parent review not found" },
          { status: 404 }
        );
      }
    }

    const user = await User.findOne({ userid: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create review/comment
    const newReview = await Review.create({
      foodItem: foodItemId,
      user: user._id,
      rating: parentReviewId ? null : rating, // Only top-level reviews have ratings
      comment,
      parentReview: parentReviewId || null
    });

    // Update parent review's replies if exists
    if (parentReviewId) {
      await Review.findByIdAndUpdate(parentReviewId, {
        $push: { replies: newReview._id }
      });
    }

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const foodItemId = searchParams.get("foodItemId");
    
    if (!foodItemId) {
      return NextResponse.json(
        { error: "Food item ID required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get top-level reviews (no parent)
    const topLevelReviews = await Review.find({ 
      foodItem: foodItemId,
      parentReview: null 
    })
    .populate("user", "first_name last_name")
    .exec();

    // Recursively populate replies
    const populatedReviews = await populateReplies(topLevelReviews);

    return NextResponse.json(populatedReviews, { status: 200 });

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}