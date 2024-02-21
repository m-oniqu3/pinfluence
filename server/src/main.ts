import "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "module-alias/register";

import { loadUserFromToken } from "@/middleware/auth";
import cookieParser from "cookie-parser";
import router from "./routes";

const app = express();

const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// app.use(loggerMiddleware);

app.use(loadUserFromToken);

app.use("/api", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
