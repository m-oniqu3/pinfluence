import { type Request, type Response } from "express";

export async function getUserProfile(req: Request, res: Response) {
  console.log(req.body, "from profile controller");

  // let { data: profiles, error } = await supabase.from("profiles").select("*");
  res.status(200).json({ data: "Profile data" });
}
