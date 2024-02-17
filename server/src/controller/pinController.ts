import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

import { type Request, type Response } from "express";

// upload file to supabase storage
async function uploadFile(file: Express.Multer.File, userId: string) {
  const fileBase64 = decode(file.buffer.toString("base64"));

  const { data, error } = await supabase.storage
    .from(`created-pins/${userId}`)
    .upload(file.originalname, fileBase64, {
      contentType: "image/png",
    });

  return { fileData: data, fileError: error };
}

// upload pin details to the database
async function uploadPinDetails(req: Request, publicUrl: string, fileName: string) {
  const details = {
    user_id: req.user!.id,
    name: req.body.name,
    description: req.body.desc,
    link: req.body.link,
    image: publicUrl,
    image_name: fileName,
  };

  const { data, error } = await supabase
    .from("created-pins")
    .insert([details])
    .select("id")
    .single();

  return { pinData: data, pinError: error };
}

// remove file from supabase storage
async function removeFileFromStorage(userId: string, path: string) {
  const { data, error } = await supabase.storage.from("created-pins").remove([`${userId}/${path}`]);
  return { deleteData: data, deleteError: error };
}

// upload tags for the pin to the database
async function uploadTags(tags: string, pinId: number) {
  // convert comma separated string to array of integers
  const tagIds = tags.split(",").map((tag) => parseInt(tag));

  // create array of objects to be inserted
  const tagsData = tagIds.map((tagId) => {
    return { pin_id: pinId, tag_id: tagId };
  });

  const { data, error } = await supabase.from("created-pins-tags").insert(tagsData).select("id");

  return { tagsData: data, tagsError: error };
}

export async function createPin(req: Request, res: Response) {
  try {
    const user = req.user as User;
    const file = req.file as Express.Multer.File | undefined;

    if (!file || !file.buffer) {
      throw new Error("No file uploaded");
    }

    //upload to supabase storage
    const { fileData, fileError } = await uploadFile(file, user.id);
    if (fileError || !fileData) throw fileError;

    //get public url of the uploaded file
    const { data: photo } = supabase.storage
      .from("created-pins")
      .getPublicUrl(`${user.id}/${fileData.path}`);

    //add pin details to db
    const { pinData, pinError } = await uploadPinDetails(req, photo.publicUrl, file.originalname);

    if (pinError || !pinData) {
      //delete the uploaded file from storage
      const { deleteError } = await removeFileFromStorage(user.id, fileData.path);

      if (deleteError) {
        console.log("Error deleting file", deleteError.message);
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
      const { tagsError } = await uploadTags(req.body.tags, pinData.id);

      if (tagsError) {
        console.log("Error adding tags", tagsError.message);
      }
    }

    return res.status(200).json({ data: "Pin created successfully" });
  } catch (error) {
    if (error.code) {
      console.log(error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function getCreatedPins(req: Request, res: Response) {
  try {
    const user = req.user as User;

    const { data, error } = await supabase
      .from("created-pins")
      .select("id, name, image")
      .eq("user_id", user.id);

    if (error) throw error;

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error.message);
    if (error.code) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
