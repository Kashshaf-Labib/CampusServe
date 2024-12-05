import { Schema, model, models } from "mongoose";

// Define IUser interface
export interface IUser {
  userid: string; // Clerk user ID
  email: string;
  first_name: string;
  last_name: string;
  token?: string; // Optional token for food orders
  orders: string[]; // Array of order IDs this student has made
  createdAt: Date;
}

// Define user schema
const userSchema = new Schema<IUser>({
  userid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  token: { type: String }, // Store token for food order identification
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }], // Reference to Order model
  createdAt: { type: Date, default: Date.now },
});

// Register the model properly using the capitalized "User"
const User = models.User || model<IUser>("User", userSchema);

export default User;
