// import mongoose from "mongoose";

// const connectDB = async () => {
//   if (!process.env.MONGODB_URI) {
//     throw new Error("MONGODB_URI is not defined");
//   }
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: process.env.DBNAME,
//     });
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;


