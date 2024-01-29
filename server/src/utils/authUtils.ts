import { supabase } from "@server/lib/supabaseClient";
import { AuthError } from "@supabase/supabase-js";

export async function getUserFromToken(token: string) {
  try {
    console.log("get user from token");
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      throw error;
    }

    return data.user;
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      console.log(error);
    } else {
      console.log("Something went wrong. Could not get user from token.");
    }
  }
}
