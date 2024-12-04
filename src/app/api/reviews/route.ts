import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/db/config";
import Review from "@/lib/models/Review";
import FoodItem from "@/lib/models/FoodItem";
import User from "@/lib/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "POST":
      try {
        const { foodItemId, userId, rating, comment } = req.body;

        // Validate inputs
        if (!foodItemId || !userId || !rating || !comment) {
          return res.status(400).json({ error: "All fields are required." });
        }

        // Check if the food item exists
        const foodItem = await FoodItem.findById(foodItemId);
        if (!foodItem) {
          return res.status(404).json({ error: "Food item not found." });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        // Create a new review
        const review = await Review.create({
          foodItem: foodItemId,
          student: userId,
          rating,
          comment,
        });

        res.status(201).json(review);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add review." });
      }
      break;

    case "GET":
      try {
        const { foodItemId } = req.query;

        if (!foodItemId) {
          return res.status(400).json({ error: "Food item ID is required." });
        }

        const reviews = await Review.find({ foodItem: foodItemId }).populate(
          "student",
          "userid email"
        );
        res.status(200).json(reviews);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch reviews." });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed." });
      break;
  }
}
