import express from "express";
import { getUserProfile } from "../controller/profileController";

const router = express.Router();

router.post("/", getUserProfile);

export default router;
