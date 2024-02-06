import { AuthError } from "@supabase/supabase-js";
import { type Request, type Response } from "express";
import { supabase } from "../lib/supabaseClient";

export async function getUserProfile(req: Request, res: Response) {
  try {
    console.log(req.body, "from profile controller");

    const id = req.body.id;

    if (!id) {
      throw new Error("Invalid request body");
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (profile.avatar_url) {
      const { data: photo } = supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_url);

      profile.avatar_url = photo.publicUrl;
    }

    return res.status(200).json({ data: profile });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
