import { supabase } from "@/lib/supabaseClient";
import { PostgrestError, User } from "@supabase/supabase-js";
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
    const range = String(req.query.range).split(",").map(Number);

    if (!userId) {
      throw new Error("User id is required");
    }

    const { data, error } = await supabase
      .from("created-pins")
      .select("id, name, image")
      .eq("user_id", userId)
      .range(range[0], range[1])
      .order("created_at", { ascending: false });

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

/**
 *
 * @param req Request
 * @param res Response
 * @returns SavedPinPreview
 * @description Returns limited number of pins that are saved to given board by given user
 */
export async function getSavedPinsLimit(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const { limit, boardId } = req.query as {
      limit: string;
      boardId: string;
    };

    if (!userId || !boardId) {
      throw new Error("Missing required parameters");
    }

    // get saved pins for the board
    const { data: pinIDs, error } = await supabase
      .from("saved-pins")
      .select("pin_id")
      .eq("board_id", +boardId)
      .eq("user_id", userId);

    if (error) throw error;

    // number of pins saved to the board
    const pinCount = pinIDs.length;

    const selectedPins = pinIDs.slice(0, +limit);

    // if no pins are saved to the board, return early
    if (selectedPins.length === 0) {
      return res.status(200).json({ data: { pins: [], count: 0 } });
    }

    const pinData: { id: number; name: string; image: string; user_id: string }[] = [];

    // for of loop instead of supabase.in to include duplicate pins
    for (let id of selectedPins as { pin_id: number }[]) {
      const { data, error } = await supabase
        .from("created-pins")
        .select("id, name, image, user_id")
        .eq("id", id.pin_id)
        .single();

      if (error) throw error;

      if (data) pinData.push(data as { id: number; name: string; image: string; user_id: string });
    }

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

/**
 *
 * @param req Request
 * @param res Response
 * @returns SavedPinPreview
 * @description Returns a range of pins that are saved to given board by given user
 */
export async function getSavedPinsRange(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const { range, boardId } = req.query as {
      boardId: string;
      range: string;
    };

    console.log(userId, boardId, range);

    const [from, to] = String(range).split(",").map(Number);

    console.log(from, to);

    if (!userId || !boardId) {
      throw new Error("Missing required parameters");
    }

    // Query to get the pin count
    const { count } = (await supabase
      .from("saved-pins")
      .select("pin_id", { count: "exact" })
      .eq("board_id", boardId)
      .eq("user_id", userId)) as { count: number };

    if (count === 0) {
      return res.status(200).json({ data: { pins: [], count: 0 } });
    }

    // Query to get pins within the specified range
    const { data: savedPins, error } = await supabase
      .from("saved-pins")
      .select("id, pin_id")
      .eq("board_id", boardId)
      .eq("user_id", userId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const pinIds = savedPins.map((p) => p.pin_id);

    // get pin details for the saved pins
    const { data: pinDetails, error: pinError } = (await supabase
      .from("created-pins")
      .select("id, name, image, user_id")
      .in("id", pinIds)) as {
      data: { id: number; name: string; image: string; user_id: string }[];
      error: PostgrestError | null;
    };

    if (pinError) throw pinError;

    // use pin id as key for the map
    const pinDetailsMap = new Map<
      number,
      { id: number; name: string; image: string; user_id: string }
    >();

    // add pin details to the map
    pinDetails.forEach((pin) => pinDetailsMap.set(pin.id, pin));

    // combine saved pins with pin details using hashmap lookup
    // this is to include the id of the saved pin because saved pins are not unique, they can be duplicates
    // but the id of the saved pin is unique
    const combinedData = savedPins.map((savedPin) => {
      const pinDetail = pinDetailsMap.get(savedPin.pin_id as number);
      return { id: savedPin.id, pin: pinDetail };
    }) as { id: number; pin: { id: number; name: string; image: string; user_id: string } }[];

    return res.status(200).json({ data: { pins: combinedData, count: count } });
  } catch (error) {
    console.log(error.message);
    if (error.code) {
      return res.status(400).json({ error: error.message });
    }

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

export async function deleteSavedPin(req: Request, res: Response) {
  try {
    const { savedPinID } = req.params;
    const user = req.user as User;

    console.log("deleteSavedPin", savedPinID);

    const { data, error } = await supabase
      .from("saved-pins")
      .delete()
      .eq("id", savedPinID)
      .eq("user_id", user.id)
      .select();

    if (error) throw error;

    if (!data) {
      throw new Error("Error deleting pin");
    }

    console.log(data);

    return res.status(200).json({ data: "Pin removed from board successfully" });
  } catch (error) {
    console.log(error.message);
    if (error.code) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

/**
 *
 * @param req Request
 * @param res Response
 * @description Delete multiple saved pins from the board
 */
export async function deleteMultipleSavedPins(req: Request, res: Response) {
  try {
    const { savedPinIDs } = req.body as { savedPinIDs: string };
    const user = req.user as User;

    if (!savedPinIDs || !user.id) {
      throw new Error("Missing required parameters to delete multiple pins");
    }

    console.log("savedPinIDs", JSON.parse(savedPinIDs));

    console.log("deleteMultipleSavedPins", savedPinIDs);

    const { data, error } = await supabase
      .from("saved-pins")
      .delete()
      .in("id", JSON.parse(savedPinIDs))
      .eq("user_id", user.id)
      .select();

    if (error) throw error;

    if (!data) {
      return res.status(400).json({ error: "Error deleting pins" });
    }

    console.log(data);

    return res.status(200).json({ data: "Pins removed from board successfully" });
  } catch (error) {
    console.log(error.message, "from deleteMultipleSavedPins");
    if (error.code) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
