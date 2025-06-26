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
import cors from "cors"; 

connectDB();

const app = express();

// ✅ CORS must come before routes
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://buyandsell-frontend.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/bids", bidsRoute);
app.use("/api/notifications", notificationsRoute);

const port = process.env.PORT;


const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/client/dist')));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });

// // Simulate __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Deployment config
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(port, () => {
  console.log(`Node/Express Server started on port ${port}`);
});
