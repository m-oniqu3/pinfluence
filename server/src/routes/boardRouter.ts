import {
  createBoard,
  deleteBoard,
  getBoardById,
  getBoardOwner,
  getBoards,
  getCurrentUserBoards,
  updateBoard,
} from "@/controller/boardController";
import { requireAuth } from "@/middleware/auth";
import { checkBoardOwner, checkBoardPermission } from "@/middleware/board";

import express from "express";

const router = express.Router();

//get current user boards
router.get("/", requireAuth, getCurrentUserBoards);

router.post("/", requireAuth, createBoard);

// public route to get board owner
router.get("/:boardID/user/:userID", checkBoardOwner, getBoardOwner);

// get other user boards
router.get("/user/:userId", getBoards);

router.get("/:id", requireAuth, getBoardById);
router.put("/:id", requireAuth, checkBoardPermission, updateBoard);

router.delete("/:id", requireAuth, checkBoardPermission, deleteBoard);

export default router;
