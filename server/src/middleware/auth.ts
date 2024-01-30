import { getUserFromToken } from "@server/utils/authUtils";
import { type User } from "@supabase/supabase-js";
import { type NextFunction, type Request, type Response } from "express";

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
  _res: Response,
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
    console.error("Error verifying token:", error);

    //do next(error) to pass error to express error handler
    next();
  }
}

//middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("requireAuth");
  if (!req.user) {
    console.log("Unauthorized, no user found");
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
