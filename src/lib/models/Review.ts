import { Schema, model, models } from "mongoose";

export interface IReview {
  foodItem: Schema.Types.ObjectId; // Reference to FoodItem
  student: Schema.Types.ObjectId; // Reference to User
  rating: number; // Rating (1-5 scale)
  comment: string; // Review comment
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  foodItem: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = models.Review || model<IReview>("Review", reviewSchema);
export default Review;

