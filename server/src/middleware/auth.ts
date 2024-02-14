import { AuthError, type User } from "@supabase/supabase-js";
import { type NextFunction, type Request, type Response } from "express";
import { getUserFromToken } from "../utils/authUtils";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

// this middleware checks for the authorization header
export async function loadUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("loadUser");

  req.user = null;

  const authHeader = req.headers.authorization;

  if (!authHeader) return next();

  const brokenHeader = authHeader.split(" ");

  if (brokenHeader.length !== 2) return next();

  const token = brokenHeader[1];

  try {
    //verify token with supabase
    const user = await getUserFromToken(token);

    // attach user to request
    if (user) {
      req.user = user;
    }

    next();
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      console.log("middleware", error.name, error.message, error.status);

      // Check if the error indicates that the token is expired
      if (error.status === 401) {
        console.log("Token expired");

        return res
          .status(401)
          .send("Token expired. Please try registering or logging in again.");
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
    res.status(401).send("Unauthorized. No user found");
    return;
  } else {
    next();
  }
}
