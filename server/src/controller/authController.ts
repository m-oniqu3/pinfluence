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

    //send required user data and token
    const { user, session } = data;

    const userData = { id: user.id, email: user.email };

    const token = session.access_token;
    const expiry = session.expires_at;

    // set the refresh token as a cookie
    res.cookie("refresh_token", session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(200)
      .json({ data: { user: userData, token: { access_token: token, expiry } } });
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
  const redirectUrl = new URL(process.env.REDIRECT_URL ?? "http://localhost:3000/verification/");

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
export async function logout(req: Request, res: Response) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    const cookies = req.cookies;

    if (cookies.refresh_token) {
      res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "none" });
      console.log("refresh token cleared");
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

export async function refresh(req: Request, res: Response) {
  try {
    console.log("attempting to refresh token");
    const refresh_token = req.cookies.refresh_token;

    console.log("refresh token", refresh_token);

    if (!refresh_token) {
      return res.status(401).json({ error: "No refresh token found" });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      throw error;
    }

    if (!data || !data.session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = data.session.access_token;
    const refresh = data.session.refresh_token;
    const expiry = data.session.expires_at;
    const user = { id: data.session.user.id, email: data.session.user.email };

    // set the refresh token as a cookie
    res.cookie("refresh_token", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log(user, token);

    return res.status(200).json({
      data: { user, token: { access_token: token, expiry } },
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.log("auth error", error.message);
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message ?? "Internal server error" });
  }
}
