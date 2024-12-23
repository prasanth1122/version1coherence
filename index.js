import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Import cookie-parser
import paymentRoute from "./routes/paymentRoute.js";
import userRoutes from "./routes/userRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import collectionRoute from "./routes/collectionRoutes.js";
import "./cronJobs/deactivateExpiredSubscriptions.js";
import commentRoutes from "./routes/commentRoute.js";
import libraryRoute from "./routes/libraryRoutes.js";
import periodicalRoute from "./routes/periodicalRoutes.js";
import likedislikeRoute from "./routes/likedislikeRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(express.json());
app.use(cookieParser()); // Add this middleware here

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/library", libraryRoute);
app.use("/api/periodical", periodicalRoute);
// Default route for testing server
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/comments", commentRoutes);
app.use("/api/likedislike", likedislikeRoute);
app.use("/api/collection", collectionRoute);
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
