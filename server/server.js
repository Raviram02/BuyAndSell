import dotenv from "dotenv";
dotenv.config();
// console.log('MONGO_URI:', process.env.MONGO_URI);

import express from "express";
import connectDB from "./config/dbConfig.js";
import usersRoute from "./routes/usersRoute.js";
import productsRoute from "./routes/productsRoutes.js";
import bidsRoute from "./routes/bidsRoute.js";
import notificationsRoute from "./routes/notificationsRoute.js";
import path from "path";
// import { fileURLToPath } from "url";
import cors from "cors";

connectDB();
const port = process.env.PORT || 5000;
const app = express();

const __dirname = path.resolve();

// ✅ CORS must come before routes
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://buyandsell-frontend.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/bids", bidsRoute);
app.use("/api/notifications", notificationsRoute);

app.use(express.static(path.join(__dirname, "/client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
// });

app.listen(port, () => {
  console.log(`Node/Express Server started on port ${port}`);
});
