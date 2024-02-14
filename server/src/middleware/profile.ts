import { type User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

import { type NextFunction, type Request, type Response } from "express";

/**
 *
 *
 * This middleware checks if the user is authorized to update the profile by comparing the profile ID from the route parameters with the user's profile ID.
 */
export async function checkProfilePermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const profileId = req.params.id; // Get the profile ID from route parameters
  const user = req.user as User;
  const userId = user.id;

  try {
    // Query the profile from Supabase based on userId
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    // if profile doesn't exist or doesn't match the provided profileId, send a 403 Forbidden response
    // this means that the user is not authorized to update the profile
    if (!data || data.id !== profileId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();

    return;
  } catch (error: any) {
    console.error("Error querying profile:", error);

    if (error.code && error.message) {
      // Handle PostgrestError (Supabase API error)
      return res.status(error.code).json({ error: error.message });
    } else {
      // Handle other errors
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default checkProfilePermission;
