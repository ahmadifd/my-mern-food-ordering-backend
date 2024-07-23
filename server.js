import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/dbConn.js";
import authRoutes from "./routes/authRoutes.js";
import myUserRoutes from "./routes/myUserRoutes.js";
import myRestaurantRoutes from "./routes/myRestaurantRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import { credentials } from "./middleware/credentials.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3800;

const app = express();

connectDB();

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '/public')));

app.use("/auth", authRoutes);

app.use("/my/user", myUserRoutes);

app.use("/my/restaurant", myRestaurantRoutes);

app.use("/restaurant", restaurantRoutes);

app.use("/order", orderRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
