import { createTag, getTags } from "@/controller/tagController";
import { requireAuth } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.post("/", requireAuth, createTag);
router.get("/:tag", requireAuth, getTags);

export default router;
