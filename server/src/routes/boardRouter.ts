import { createBoard, getBoardById, getBoards, updateBoard } from "@/controller/boardController";
import { requireAuth } from "@/middleware/auth";
import { checkBoardPermission } from "@/middleware/board";

import express from "express";

const router = express.Router();

router.get("/", requireAuth, getBoards);
router.post("/", requireAuth, createBoard);
router.get("/:id", requireAuth, getBoardById);
router.put("/:id", requireAuth, checkBoardPermission, updateBoard);

export default router;
