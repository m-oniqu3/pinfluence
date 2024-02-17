import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

import { type Request, type Response } from "express";

export async function createPin(req: Request, res: Response) {
  try {
    const user = req.user as User;

    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      throw new Error("No file uploaded");
    }

    if (!file.buffer) {
      throw new Error("File buffer is undefined");
    }

    //decode file buffer to base64
    const fileBase64 = decode(file.buffer.toString("base64"));

    console.log(file);
    //upload to supabase storage
    const { data, error } = await supabase.storage
      .from(`created-pins/${user.id}`)
      .upload(file.originalname, fileBase64, {
        contentType: "image/png",
      });

    if (error) {
      throw error;
    }

    //get public url of the uploaded file
    const { data: photo } = supabase.storage
      .from("created-pins")
      .getPublicUrl(`${user.id}/${data.path}`);

    //add pin details to the database
    const { data: pinData, error: pinError } = await supabase
      .from("created-pins")
      .insert([
        {
          user_id: user.id,
          name: req.body.name,
          description: req.body.description,
          link: req.body.link,
          image: photo.publicUrl,
          image_name: file.originalname,
        },
      ])
      .select("id")
      .single();

    if (pinError) {
      //delete the uploaded file from storage
      console.log("Error creating pin", pinError.message, pinError.code);
      const { data: deleteData, error: deleteError } = await supabase.storage
        .from("created-pins")
        .remove([`${user.id}/${data.path}`]);

      console.log(`${user.id}/${data.path}`);
      console.log("delete data", deleteData);

      if (deleteError) {
        console.error(
          "Error deleting file",
          deleteError.message,
          deleteError.name
        );
      }
      throw pinError;
    }

    //save pin to board if boardId is provided
    if (req.body.boardId) {
      //save pin to board
      console.log(req.body.boardId);
    }

    //add pin tags to the database if any

    if (req.body.tags) {
      console.log(pinData.id);
    }

    return res.status(200).json({ data: "Pin created successfully" });
  } catch (error) {
    if (error.code) {
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
