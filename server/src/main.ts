import "dotenv/config";
import { loadUser } from "./middleware/auth";
import router from "./routes";

import cors from "cors";

import express from "express";
import { loggerMiddleware } from "src/middleware/logger";

const app = express();

const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.use(loadUser);
app.use("/api", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
