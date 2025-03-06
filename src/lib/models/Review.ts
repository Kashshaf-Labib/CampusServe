// import "./User";
// import "./FoodItem";
// import { Schema, model, models } from "mongoose";

// export interface IReview {
//   foodItem: Schema.Types.ObjectId; // Reference to FoodItem
//   user: Schema.Types.ObjectId; // Reference to User
//   rating: number; // Rating (1-5 scale)
//   comment: string; // Review comment
//   createdAt: Date;
// }

// const reviewSchema = new Schema<IReview>({
//   foodItem: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
//   user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   comment: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const Review = models.Review || model<IReview>("Review", reviewSchema);
// export default Review;

import "./User";
import "./FoodItem";
import { Schema, model, models } from "mongoose";

export interface IReview {
  foodItem: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  rating?: number; // Make rating optional for comments
  comment: string;
  parentReview?: Schema.Types.ObjectId;
  replies: IReview[];
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  foodItem: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, required: true },
  parentReview: { type: Schema.Types.ObjectId, ref: "Review" },
  replies: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  createdAt: { type: Date, default: Date.now },
});

const Review = models.Review || model<IReview>("Review", reviewSchema);
export default Review;
