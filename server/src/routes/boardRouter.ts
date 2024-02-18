import { createBoard, getBoardById, getBoards } from "@/controller/boardController";
import { requireAuth } from "@/middleware/auth";

import express from "express";

const router = express.Router();

router.get("/", requireAuth, getBoards);
router.post("/", requireAuth, createBoard);
router.get("/:id", requireAuth, getBoardById);

export default router;
