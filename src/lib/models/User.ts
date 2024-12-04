import { Schema, model,models} from "mongoose";

export interface IUser {
  userid: string;
  email: string;
  first_name:string,
  last_name:string,
  token?: string; // Optional if suer wants to store the token used for the order
  orders: string[]; // Array of order IDs this student has made
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  userid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  first_name: { type: String, required: true, unique: true },
  last_name: { type: String, required: true, unique: true },
  token: { type: String }, // Store token for food order identification
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }], // Reference to Order model
  createdAt: { type: Date, default: Date.now },
});

const User = models.user || model<IUser>("user", userSchema);
export default User;
