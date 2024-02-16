import { supabase } from "@/lib/supabaseClient";
import { type Request, type Response } from "express";

export async function getTags(req: Request, res: Response) {
  try {
    const val = req.params.tag;

    if (!val) {
      throw new Error("Search value is required to get tags");
    }

    const { data, error } = await supabase
      .from("tags")
      .select("id, name")
      .ilike("name", `%${val}%`);

    if (error) {
      throw error;
    }

    console.log(data);
    res.status(200).json({ data: data });
  } catch (error) {
    if (error.code) {
      res.status(400).json({ error: error.message });
    }

    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

export async function createTag(req: Request, res: Response) {
  try {
    const tag: string = req.body.tag;

    if (!tag) {
      throw new Error("Value is required to create a tag");
    }

    const { data, error } = await supabase
      .from("tags")
      .insert([{ name: tag }])
      .select("id, name")
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({ data: data });
  } catch (error) {
    if (error.code) {
      res.status(400).json({ error: error.message });
    }

    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
