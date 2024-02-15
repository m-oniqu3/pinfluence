import { type Request, type Response } from "express";

export async function createBoard(req: Request, res: Response) {
  console.log(req.body);
  res.status(200).json({ data: "Board created" });
}
