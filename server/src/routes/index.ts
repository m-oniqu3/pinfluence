import { Router } from "express";
import authRouter from "./authRouter";
import boardRouter from "./boardRouter";
import profileRouter from "./profileRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/boards", boardRouter);

export default router;
