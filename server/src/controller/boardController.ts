import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { type Request, type Response } from "express";

export async function createBoard(req: Request, res: Response) {
  try {
    console.log(req.body);
    const user = req.user as User;

    const { name, secret } = req.body;

    if (!name || secret === undefined) {
      throw new Error("Invalid request body");
    }

    const { data, error } = await supabase
      .from("boards")
      .insert([{ name, secret, user_id: user.id }])
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ data: data.id });
  } catch (error) {
    if (error.code) {
      // postgrest error
      console.log(error.message, error.details, error.hint);
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function getBoards(req: Request, res: Response) {
  try {
    const sortBy = (req.query.sortBy as string) ?? "created_at";
    const order = (req.query.order as string) ?? "desc";

    const user = req.user as User;

    const { data, error } = await supabase
      .from("boards")
      .select("id, name, secret, created_at")
      .order(sortBy, { ascending: order === "asc" })
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return res.status(200).json({ data: data });
  } catch (error) {
    if (error.code) {
      // postgrest error
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
