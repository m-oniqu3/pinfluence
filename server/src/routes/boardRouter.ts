import {
  createBoard,
  deleteBoard,
  getBoardById,
  getBoardOwner,
  getBoards,
  getCurrentUserBoards,
  getRecentBoards,
  updateBoard,
} from "@/controller/boardController";
import { requireAuth } from "@/middleware/auth";
import { checkBoardExists, checkBoardOwner, checkBoardPermission } from "@/middleware/board";

import express from "express";

const router = express.Router();

//get current user boards
router.get("/", requireAuth, getCurrentUserBoards);
router.get("/recents", requireAuth, getRecentBoards);

router.post("/", requireAuth, checkBoardExists, createBoard);

// public route to get board owner
router.get("/:boardID/user/:userID", checkBoardOwner, getBoardOwner);

// get other user boards
router.get("/user/:userId", getBoards);

router.get("/:id", requireAuth, getBoardById);
router.put("/:id", requireAuth, checkBoardPermission, updateBoard);

router.delete("/:id", requireAuth, checkBoardPermission, deleteBoard);

export default router;
