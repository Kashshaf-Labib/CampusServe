import "./User";
import "./FoodItem";
import { Schema, model, models } from "mongoose";

export interface IOrder {
  user: String; // Reference to clerk user
  foodItems: { foodItem: Schema.Types.ObjectId; quantity: number }[]; // Food items with quantities
  token: string; // Token for order identification
  totalAmount: number;
  status: "pending" | "completed" | "cancelled" | "delivered"; // Order status
  toBeDelivered: boolean; // Whether the order needs to be delivered
  paid: boolean; // Payment status
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: String, ref: "User", required: true },
    foodItems: [
      {
        foodItem: {
          type: Schema.Types.ObjectId,
          ref: "FoodItem",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    token: { type: String, required: true, unique: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "cancelled", "delivered"],
    },
    toBeDelivered: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
