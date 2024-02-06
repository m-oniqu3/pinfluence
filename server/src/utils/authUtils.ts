import { type User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    console.log("get user from token");

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      throw error;
    }

    return data.user;
  } catch (error: unknown) {
    throw error;

    // if (error instanceof AuthError) {

    //   console.log(error);
    // } else {
    //   console.log("Something went wrong. Could not get user from token.");
    // }
  }
}
