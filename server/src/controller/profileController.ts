import { StorageError } from "@supabase/storage-js";
import { AuthError, User } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";
import { type Request, type Response } from "express";
import { supabase } from "../lib/supabaseClient";

// we dont get the id from req.user because this is access from a public route
export async function getUserProfileById(req: Request, res: Response) {
  try {
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

    return res.status(200).json({ data: profile });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const user = req.user as User;
    const id = user.id;

    if (!id) {
      throw new Error("Missing identification for user");
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
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

export async function updateProfile(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error("Missing identification for user");
    }

    if (!req.body.full_name || !req.body.username) {
      throw new Error("Invalid request body");
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id,
        full_name: req.body.full_name,
        username: req.body.username,
        website: req.body.website,
        avatar_url: req.body.avatar_url,
        about: req.body.about,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ data });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProfileAvatar(req: Request, res: Response) {
  try {
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      throw new Error("No file uploaded");
    }

    if (!file.buffer) {
      throw new Error("File buffer is undefined");
    }

    // Decode file buffer to raw binary data
    const fileBase64 = decode(file.buffer.toString("base64"));

    const fileExt = file.originalname.split(".").pop();
    const filePath = `${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, fileBase64, {
        contentType: "image/png",
      });

    if (error) {
      throw error;
    }

    const { data: photo } = supabase.storage
      .from("avatars")
      .getPublicUrl(data.path);

    return res.status(200).json({ data: photo.publicUrl });
  } catch (error: unknown) {
    if (error instanceof StorageError) {
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
