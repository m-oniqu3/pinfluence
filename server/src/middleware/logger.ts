import { Response, type NextFunction, type Request } from "express";

export function loggerMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.log("headers", req.headers);
  console.log("body", req.body);
  next();
}
