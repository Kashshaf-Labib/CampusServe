"use server";

import User from "@/lib/models/User";
import { dbConnect } from "@/db/config";

export async function createUser(user: any) {
  try {
    await dbConnect();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

/*a web hook is going to call this function when there is a new user in clerk and this function is going to 
to create a new user in mongodb database. */
