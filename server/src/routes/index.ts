import { Router } from "express";
import authRouter from "./authRouter";
import profileRouter from "./profileRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);

export default router;
