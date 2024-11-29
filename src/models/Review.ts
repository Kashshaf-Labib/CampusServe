import { Schema, model, Document } from "mongoose";

interface IReview extends Document {
  foodItem: { type: Schema.Types.ObjectId; ref: "FoodItem" }; // Reference to the food item
  student: { type: Schema.Types.ObjectId; ref: "User" }; // Reference to the student leaving the review
  rating: number; // Rating (1-5 scale)
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  foodItem: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = model<IReview>("Review", reviewSchema);
export default Review;
