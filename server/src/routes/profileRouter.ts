import express from "express";
import multer from "multer";
import {
  getUserProfile,
  getUserProfileById,
  updateProfile,
  updateProfileAvatar,
} from "../controller/profileController";

import { requireAuth } from "../middleware/auth";
import checkProfilePermission from "../middleware/profile";

const router = express.Router();

// Store uploaded files in memory
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

router.get("/", requireAuth, getUserProfile);
router.get("/user/:userId", getUserProfileById);

router.put("/:id", requireAuth, checkProfilePermission, updateProfile);
router.post(
  "/:id/avatar",
  requireAuth,
  checkProfilePermission,
  upload.single("file"),
  updateProfileAvatar
);

export default router;
