import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";

// check if board exists and belongs to the user
export async function checkBoardOwnership(req: Request, res: Response, next: NextFunction) {
  try {
    const boardId = req.body.boardId;
    const user = req.user as User;

    if (!boardId) {
      return res.status(400).json({ error: "Missing boardId" });
    }

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
      return res
        .status(403)
        .json({ error: "Forbidden. Board does not exist or does not belong to the user" });
    }

    console.log("Permission to save pin to board granted");

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

//check pin existence
export async function checkPinExistence(req: Request, res: Response, next: NextFunction) {
  try {
    const pinId = req.params.pinId;

    if (!pinId) {
      return res.status(400).json({ error: "Missing pinId" });
    }

    const { data, error } = await supabase
      .from("created-pins")
      .select("id")
      .eq("id", +pinId)
      .single();

    if (error) {
      throw error;
    }

    // if pin doesn't exist, send a 404 Not Found response
    if (!data || data.id !== +pinId) {
      return res.status(404).json({ error: "Pin not found" });
    }

    console.log("Pin exists");

    return next();
  } catch (error: any) {
    console.error("Error querying pin:", error);
    if (error.code && error.message) {
      return res.status(error.code).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

//check saved pin existence
export async function checkSavedPinExistence(req: Request, res: Response, next: NextFunction) {
  try {
    const savedPinID = req.params.savedPinID;
    const user = req.user as User;

    if (!savedPinID) {
      return res.status(400).json({ error: "Missing savedPinID" });
    }

    // check if saved pin exists and belongs to the user
    const { data, error } = await supabase
      .from("saved-pins")
      .select("id")
      .eq("id", +savedPinID)
      .eq("user_id", user.id)
      .single();

    if (error) {
      throw error;
    }

    // if saved pin doesn't exist, send a 404 Not Found response
    if (!data || data.id !== +savedPinID) {
      return res.status(404).json({ error: "Saved pin not found" });
    }

    console.log("Saved pin exists");

    return next();
  } catch (error: any) {
    console.error("Error querying saved pin:", error);
    if (error.code) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message ?? "Internal Server Error" });
    }
  }
}
