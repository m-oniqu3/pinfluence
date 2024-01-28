import { inRecord, isFunction, isRecord, toEntries } from "@sa-net/utils";
import cors from "cors";
import express from "express";

const app = express();

const serverURL = new URL(
  import.meta.env.SERVER_URL ?? "http://localhost:3001"
);
const PORT = parseInt(serverURL.port) ?? 3001;

app.use(cors());
app.use(express.json());

// returns an object of all the files in the routes folder
const routes = import.meta.glob("./routes/**/*.ts", { eager: true });

/**
 * check if the file is a route file
 * check if is an object, has router property that is a function
 * if it is, use the route
 */
for (const [path, im] of toEntries(routes)) {
  if (isRecord(im) && inRecord(im, ["router"]) && isFunction(im.router)) {
    app.use("/api", im.router);
  } else {
    console.warn(`invalid route file: ${path}`);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
