import { createBoard } from "@/controller/boardController";
import { requireAuth } from "@/middleware/auth";

import express from "express";

const router = express.Router();

router.post("/", requireAuth, createBoard);

export default router;
