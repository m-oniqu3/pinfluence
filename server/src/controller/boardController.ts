import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { type Request, type Response } from "express";

export async function createBoard(req: Request, res: Response) {
  try {
    console.log(req.body);
    const user = req.user as User;

    const { name, secret } = req.body;

    if (!name || secret === undefined) {
      throw new Error("Invalid request body");
    }

    const { data, error } = await supabase
      .from("boards")
      .insert([{ name, secret, user_id: user.id }])
      .select("name")
      .single();

    if (!data) {
      return res.status(400).json({ error: "Could not create board" });
    }

    if (error) {
      throw error;
    }

    return res.status(200).json({ data: "Board created successfully" });
  } catch (error) {
    if (error.code) {
      // postgrest error
      console.log(error.message, error.details, error.hint);
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

// get boards for the current user
export async function getCurrentUserBoards(req: Request, res: Response) {
  try {
    const user = req.user as User;
    const sortBy = (req.query.sortBy as string) ?? "created_at";
    const order = (req.query.order as string) ?? "desc";

    const { data, error } = await supabase
      .from("boards")
      .select("id, name, secret, created_at, user_id")
      .order(sortBy, { ascending: order === "asc" })
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return res.status(200).json({ data: data });
  } catch (error) {
    if (error.code) {
      // PostgREST error
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

/**
 *
 * @param req Request
 * @param res Response
 * @description Get boards for a specific user that is not the current user
 */
export async function getBoards(req: Request, res: Response) {
  try {
    const sortBy = (req.query.sortBy as string) ?? "created_at";
    const order = (req.query.order as string) ?? "desc";

    const authUser = req.user as User | null;

    // range is an array of two numbers
    const range = String(req.query.range)
      .split(",")
      .map((r) => parseInt(r));
    console.log("range", range);

    const userId = req.params.userId as string;

    if (!userId) {
      throw new Error("User id is required");
    }

    const { data, error } = await supabase
      .from("boards")
      .select("id, name, secret, created_at, user_id")
      .order(sortBy, { ascending: order === "asc" })
      .eq("user_id", userId)

      .range(range[0], range[1]);

    if (error) {
      throw error;
    }

    let boards = data;

    // If the authenticated user is not the owner, filter out secret boards
    if (authUser?.id !== userId) {
      boards = boards.filter((board) => !board.secret);
    }

    return res.status(200).json({ data: boards });
  } catch (error) {
    if (error.code) {
      // postgrest error
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function getBoardById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = req.user as User;

    if (!id) {
      throw new Error("Board id is required");
    }

    const { data, error } = await supabase
      .from("boards")
      .select("id, name, secret, description, user_id")
      .eq("user_id", user.id)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ data: data });
  } catch (error) {
    console.log(error.message);
    if (error.code) {
      // postgrest error
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
export async function updateBoard(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = req.user as User;

    if (!id) {
      throw new Error("Board id is required");
    }

    const { name, secret, description } = req.body as {
      name: string;
      secret: boolean;
      description: string;
    };

    console.log(user.aud, user.id, new Date(user.last_sign_in_at ?? 0).toLocaleTimeString());
    if (!name || secret === undefined) {
      throw new Error("Invalid request body");
    }

    // update board by id and user_id
    const { data, error } = await supabase
      .from("boards")
      .update({ name, secret, description })
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("Could not update board");
    }

    return res.status(200).json({ data: "Board updated successfully" });
  } catch (error) {
    console.log(error.message);
    if (error.code) {
      // postgrest error
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function deleteBoard(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = req.user as User;

    if (!id) {
      throw new Error("Missing board id. To delete a board, you need to provide the board id");
    }

    console.log("deleting board", id, user.id);

    const { data, error } = await supabase
      .from("boards")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("Could not delete board");
    }

    console.log("board deleted", data);

    return res.status(200).json({ data: `Board deleted successfully` });
  } catch (error) {
    console.log(error.message);
    if (error.code) {
      // postgrest error
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

/**
 *
 * @param req Request
 * @param res Response
 * @description Returns profile of the user who owns the board
 */
export async function getBoardOwner(req: Request, res: Response) {
  try {
    const { boardID, userID } = req.params as { boardID: string; userID: string };

    if (!boardID || !userID) {
      throw new Error("Missing required parameters");
    }

    // get profile of the user who owns the board
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", userID)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "No user found." });
    }

    //get board details
    const { data: boardData, error: boardError } = await supabase
      .from("boards")
      .select("id, name, secret, description")
      .eq("id", boardID)
      .single();

    if (boardError) {
      throw boardError;
    }

    return res.status(200).json({ data: { user: data, board: boardData } });
  } catch (error) {
    console.error("Error querying board:", error);

    if (error.code) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
}

/**
 *
 * @param req Request
 * @param res Response
 * @description Returns the most recent boards pins were saved to by the current user
 */
export async function getRecentBoards(req: Request, res: Response) {
  console.log("getting recent boards");
  try {
    const user = req.user as User;

    //get recent board ids from saved pins , unique
    const { data, error } = await supabase
      .from("saved-pins")
      .select("board_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (!data) {
      return res.status(200).json({ data: [] });
    }

    if (error) {
      throw error;
    }

    const boardIds = data.map((d) => d.board_id);

    // get recent boards
    const { data: recentBoards, error: recentBoardsError } = await supabase
      .from("boards")
      .select("id, name, secret, created_at, user_id")
      .in("id", boardIds);

    if (recentBoardsError) {
      throw recentBoardsError;
    }

    return res.status(200).json({ data: recentBoards });
  } catch (error) {
    if (error.code) {
      // PostgREST error
      return res.status(400).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
