import { Schema, model, models } from "mongoose";
import "./User";
import "./FoodItem";

export interface ICartItem {
  foodItem: Schema.Types.ObjectId; // Reference to FoodItem
  quantity: number;
}

export interface ICart {
  user: Schema.Types.ObjectId; // Reference to User
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  foodItem: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new Schema<ICart>(
  {
    user: { type: String, ref: "User", required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = models.Cart || model<ICart>("Cart", cartSchema);
export default Cart;
