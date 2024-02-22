import { supabase } from "@/lib/supabaseClient";
import { AuthError, type User } from "@supabase/supabase-js";
import { type NextFunction, type Request, type Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

// this middleware checks for the authorization header
export async function loadUserFromToken(req: Request, res: Response, next: NextFunction) {
  console.log("loadUser");

  req.user = null;

  const authHeader = req.headers.authorization;

  if (!authHeader) return next();

  const brokenHeader = authHeader.split(" ");
  if (brokenHeader.length !== 2) return next();
  const token = brokenHeader[1];

  try {
    //verify token with supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error) throw error;

    const user = data.user;
    console.log("user from token", user.id);

    // attach user to request
    if (user) {
      req.user = user;
      console.log("authenticated", user.aud);

      // // check if the session is expired
      // const { data: session, error: sessionerror } = await supabase.auth.getSession();

      // if (sessionerror) {
      //   console.log("Error getting session", sessionerror);
      //   throw sessionerror;
      // }

      // if (session.session) return next();

      // //try to refresh the session

      // const { error: refresherror } = await supabase.auth.setSession({
      //   access_token: token,
      //   refresh_token: req.cookies.refresh_token,
      // });

      // if (refresherror) {
      //   console.log("Error refreshing session", refresherror);
      //   throw refresherror;
      // }
    }
    next();
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      console.log("middleware", error.name, error.message, error.status);

      // Check if the error indicates that the token is expired
      if (error.status === 401) {
        console.log("Token expired");

        return res.status(401).json({ error: "Token expired" });
      }
    }

    console.log("Error getting user from token");
  }
}

//middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("requireAuth");
  if (!req.user) {
    console.log("Unauthorized, no user found");
    // res.status(401).redirect("/logout");
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else {
    next();
  }
}
