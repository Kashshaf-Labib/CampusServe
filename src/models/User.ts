import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  userid: string;
  email: string;
  token?: string; // Optional if suer wants to store the token used for the order
  orders: string[]; // Array of order IDs this student has made
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  userid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  token: { type: String }, // Store token for food order identification
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }], // Reference to Order model
  createdAt: { type: Date, default: Date.now },
});

const User = model<IUser>("User", userSchema);
export default User;
