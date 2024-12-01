import { Schema, model, models } from "mongoose";

export interface IFoodItem {
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional image URL for food items
  createdAt: Date;
}

const foodItemSchema = new Schema<IFoodItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const FoodItem = models.FoodItem || model<IFoodItem>("FoodItem", foodItemSchema);
export default FoodItem;
