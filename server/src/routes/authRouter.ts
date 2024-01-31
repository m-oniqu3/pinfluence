import express from "express";
import { getUser, login, logout, signup } from "../controller/authController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, getUser);
router.post("/", login);
router.post("/signup", signup);
router.delete("/", logout);

export default router;
