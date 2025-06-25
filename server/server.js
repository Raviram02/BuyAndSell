import dotenv from "dotenv";
dotenv.config();
// console.log('MONGO_URI:', process.env.MONGO_URI);

import express from "express";
import connectDB from "./config/dbConfig.js";
import usersRoute from "./routes/usersRoute.js";
import productsRoute from "./routes/productsRoutes.js";
import bidsRoute from "./routes/bidsRoute.js";
import notificationsRoute from "./routes/notificationsRoute.js";

connectDB();

const app = express();
app.use(express.json());
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/bids", bidsRoute);
app.use("/api/notifications", notificationsRoute);

const port = process.env.PORT || 5000;

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Deployment config
if (process.env.NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}



app.listen(port, () => {
  console.log(`Node/Express Server started on port ${port}`);
});
