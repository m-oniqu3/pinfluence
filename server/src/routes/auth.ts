import { isRecord } from "@sa-net/utils";
import { supabase } from "@server/lib/supabaseClient";
import { AuthError } from "@supabase/supabase-js";
import express from "express";

export const router = express.Router();

// returns the current authed user
router.get("/auth", async (req, res) => {});

// login user

router.post("/auth", async (req, res) => {
  try {
    console.log(req.body);
    // check if body is an object
    if (!isRecord(req.body)) {
      throw new Error("Invalid request body");
    }

    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      throw new Error("Invalid request body");
    }

    console.log(email, password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return res.status(200).json({ data });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      console.log("error instanceof AuthError", error.message);
      return res.status(401).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//sign up user
router.post("/auth/signup", async (_req, res) => {
  const redirectUrl = new URL(
    import.meta.env.CLIENT_URL ?? "http://localhost:3000"
  );

  const { data, error } = await supabase.auth.signUp({
    email: "example@email.com",
    password: "example-password",
    options: { emailRedirectTo: redirectUrl.toString() },
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json({ data });
});

// logout user
router.delete("/auth", async (_req, res) => {
  console.log("logout route");
});
