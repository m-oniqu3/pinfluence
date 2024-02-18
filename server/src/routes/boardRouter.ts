import {
  createBoard,
  getBoardById,
  getBoards,
  getCurrentUserBoards,
  updateBoard,
} from "@/controller/boardController";
import { requireAuth } from "@/middleware/auth";
import { checkBoardPermission } from "@/middleware/board";

import express from "express";

const router = express.Router();

//get current user boards
router.get("/", requireAuth, getCurrentUserBoards);

router.post("/", requireAuth, createBoard);

// get other user boards
router.get("/user/:userId", getBoards);

router.get("/:id", requireAuth, getBoardById);
router.put("/:id", requireAuth, checkBoardPermission, updateBoard);

export default router;
