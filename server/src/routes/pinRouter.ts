import { createPin, getCreatedPins } from "@/controller/pinController";
import { requireAuth } from "@/middleware/auth";

import { Router } from "express";
import multer from "multer";

const router = Router();

// Store uploaded files in memory
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

router.get("/", requireAuth, getCreatedPins);
router.post("/", requireAuth, upload.single("file"), createPin);

export default router;
