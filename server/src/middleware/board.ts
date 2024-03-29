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

export async function checkBoardOwner(req: Request, res: Response, next: NextFunction) {
  const { boardID, userID } = req.params as { boardID: string; userID: string };

  console.log("Checking board owner");
  try {
    if (!boardID || !userID) {
      throw new Error("Missing required parameters");
    }

    //check if the given user has the board
    const { data, error } = await supabase
      .from("boards")
      .select("id, user_id")
      .eq("id", +boardID)
      .eq("user_id", userID)
      .single();

    // if board doesn't exist or doesn't match the user's ID, send 404 Not Found response
    if (!data || data.user_id !== userID) {
      return res.status(404).json({ error: "No board found for user" });
    }

    if (error) {
      throw error;
    }

    console.log("Data from board middleware", data);

    console.log("User has the board");
    return next();
  } catch (error: any) {
    console.error("Error querying board:", error);

    if (error.code) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function checkBoardExists(req: Request, res: Response, next: NextFunction) {
  try {
    const name = req.body.name as string;
    const user = req.user as User;

    if (!name) {
      return res.status(400).json({ error: "Missing required parameters; board name" });
    }

    // check if the board already exists
    const { data, error } = await supabase
      .from("boards")
      .select("id")
      .eq("name", name)
      .eq("user_id", user.id)
      .single();

    if (!data) {
      return next();
    }

    if (data !== null) {
      return res.status(409).json({ error: "You already have a board with this name!" });
    }

    if (error) {
      throw error;
    }

    return next();
  } catch (error) {
    console.error("Error querying board:", error);

    if (error.code === "PGRST116") {
      return res.status(409).json({ error: "You already have a board with this name!" });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
