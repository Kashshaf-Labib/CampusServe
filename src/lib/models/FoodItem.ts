import { Schema, model, Document } from "mongoose";

interface IFoodItem extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional, for image of the food item
  createdAt: Date;
}

const foodItemSchema = new Schema<IFoodItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const FoodItem = model<IFoodItem>("FoodItem", foodItemSchema);
export default FoodItem;
