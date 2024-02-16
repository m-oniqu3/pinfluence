import { Router } from "express";
import authRouter from "./authRouter";
import boardRouter from "./boardRouter";
import profileRouter from "./profileRouter";
import tagRouter from "./tagRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/boards", boardRouter);
router.use("/tags", tagRouter);

export default router;
