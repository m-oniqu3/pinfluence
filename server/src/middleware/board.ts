import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";

// middleware to check if the user is the owner of the board before updating
export async function checkBoardPermission(req: Request, res: Response, next: NextFunction) {
  const boardId = req.params.id;
  const user = req.user as User;

  try {
    const { data, error } = await supabase
      .from("boards")
      .select("user_id")
      .eq("id", boardId)
      .single();

    if (error) {
      throw error;
    }

    // if board doesn't exist or doesn't match the user's ID, send a 403 Forbidden response
    if (!data || data.user_id !== user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    console.log("Permission to update board granted");
    return next();
  } catch (error: any) {
    console.error("Error querying board:", error);

    if (error.code && error.message) {
      return res.status(error.code).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
