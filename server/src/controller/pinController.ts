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
    const userId = req.params.userId;

    if (!userId) {
      throw new Error("User id is required");
    }

    const { data, error } = await supabase
      .from("created-pins")
      .select("id, name, image")
      .eq("user_id", userId);

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

export async function getSavedPinsForBoard(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const { limit, boardId } = req.query as { limit?: string; boardId: string };

    if (!userId || !boardId) {
      throw new Error("Missing required parameters");
    }

    // get saved pins for the board
    const { data, error } = await supabase
      .from("saved-pins")
      .select("pin_id")
      .eq("board_id", +boardId)
      .eq("user_id", userId);

    if (error) throw error;

    // number of pins saved to the board
    const pinCount = data.length;

    const selectedPins = limit ? data.slice(0, +limit) : data;
    const pinIds = selectedPins.map((pin) => pin.pin_id);

    // only fetch if there are pins, this is to avoid unnecessary fetch
    if (pinIds.length === 0) {
      return res.status(200).json({ data: { pins: [], count: 0 } });
    }

    const { data: pinData, error: pinError } = await supabase
      .from("created-pins")
      .select("id, name, image, user_id")
      .in("id", pinIds);

    if (pinError) throw pinError;

    return res.status(200).json({ data: { pins: pinData, count: pinCount } });
  } catch (error) {
    if (error.code) {
      console.log(error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function getPinById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("Pin id is required");
    }

    const { data, error } = await supabase
      .from("created-pins")
      .select("id, name, description, link, image, user_id, created_at")
      .eq("id", id)
      .single();

    if (error) throw error;

    // get user details for the pin
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", data.user_id)
      .single();

    if (userError) throw userError;

    const pin = { ...data, user: userData };

    return res.status(200).json({ data: pin });
  } catch (error) {
    console.log(error.message);
    if (error.code) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function savePin(req: Request, res: Response) {
  try {
    // if it reaches this function then the pin exists and the board belongs to the user
    const { pinId } = req.params;
    const { boardId } = req.body;
    const user = req.user as User;

    //save pin to board

    const { data, error } = await supabase
      .from("saved-pins")
      .insert([
        {
          pin_id: +pinId,
          board_id: +boardId,
          user_id: user.id,
        },
      ])
      .select("id")
      .single();

    if (error) throw error;

    console.log(`Pin saved to board successfully, id: ${data.id}`);

    return res.status(200).json({ data: "Pin saved to board successfully" });
  } catch (error) {
    console.log(error.message);
    if (error.code) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}