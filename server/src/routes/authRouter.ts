import { supabase } from "@/lib/supabaseClient";
import express from "express";
import { getUser, login, logout, refresh, signup } from "../controller/authController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, getUser);
router.post("/", login);
router.post("/signup", signup);
router.delete("/", logout);
router.post("/refresh", refresh);

// temporary route to get all users
router.get("/tempusers", requireAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase.from("profiles").select("id, full_name");

    if (error) {
      throw error;
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error querying profile:", error);

    if (error.code && error.message) {
      // Handle PostgrestError (Supabase API error)
      return res.status(error.code).json({ error: error.message });
    } else {
      // Handle other errors
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export default router;
