import {
  createPin,
  deleteCreatedPin,
  deleteMultipleSavedPins,
  deleteSavedPin,
  editPin,
  getAllCreatedPins,
  getCreatedPins,
  getPinById,
  getSavedPinsLimit,
  getSavedPinsRange,
  savePin,
} from "@/controller/pinController";
import { requireAuth } from "@/middleware/auth";
import {
  checkBoardOwnership,
  checkPinExistence,
  checkPinOwnership,
  checkSavedPinExistence,
} from "@/middleware/pin";

import { Router } from "express";
import multer from "multer";

const router = Router();

// Store uploaded files in memory
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

router.get("/created/:userId", getCreatedPins);
router.get("/saved/preview/:userId", getSavedPinsLimit);
router.get("/saved/board/:userId", getSavedPinsRange);
router.get("/", requireAuth, getAllCreatedPins);

router.get("/:id", getPinById);

router.post("/", requireAuth, upload.single("file"), createPin);

router.post("/save/:pinId", requireAuth, checkPinExistence, checkBoardOwnership, savePin);

router.delete("/saved/organize", requireAuth, deleteMultipleSavedPins);
router.delete("/saved/:savedPinID", requireAuth, checkSavedPinExistence, deleteSavedPin);

router.put("/:pinID", requireAuth, checkPinOwnership, editPin);
router.delete("/:pinID", requireAuth, checkPinOwnership, deleteCreatedPin);

export default router;
