import { AuthError } from "@supabase/supabase-js";
import { type Request, type Response } from "express";
import { supabase } from "../lib/supabaseClient";

/**
 * get the current user
 * if the request reaches this handler, the user is authenticated
 */
export async function getUser(req: Request, res: Response) {
  const user = req.user;

  return res.status(200).json({ data: user });
}

// login user
export async function login(req: Request, res: Response) {
  try {
    console.log(req.body);
    // check if body is an object
    // if (typeof JSON.parse(req.body) !== "object") {
    //   throw new Error("Invalid request body");
    // }

    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      throw new Error("Invalid request body");
    }

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
      return res.status(401).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//sign up user
export async function signup(req: Request, res: Response) {
  const redirectUrl = new URL(
    process.env.REDIRECT_URL ?? "http://localhost:3000/verification/"
  );

  try {
    //todo: check if req.body is an object

    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      throw new Error("Invalid request body");
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,

      options: { emailRedirectTo: redirectUrl.toString() },
    });

    if (signupError) {
      throw signupError;
    }

    if (!data || data.user === null) {
      throw new Error("Failed to sign up user. Please try again");
    }

    const base_name = email.split("@")[0];
    const username = base_name + data.user.id.split("-")[0];

    // update the user's username
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: data.user.id, username, full_name: base_name })
      .select();

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

//logout user
export async function logout(_req: Request, res: Response) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return res.status(200).json({ data: "Logout Successful" });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
