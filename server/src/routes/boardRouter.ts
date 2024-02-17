import { createBoard, getBoards } from "@/controller/boardController";
import { requireAuth } from "@/middleware/auth";

import express from "express";

const router = express.Router();

router.get("/", requireAuth, getBoards);
router.post("/", requireAuth, createBoard);

export default router;
