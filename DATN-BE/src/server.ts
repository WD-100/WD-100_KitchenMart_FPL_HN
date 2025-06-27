import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import uploadRoutes from "./routes/upload.route";
import { connectDB } from "./config/db";
import cors from "cors";
import path from "path";
import { initRoles } from "./database/initRoles";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enabel cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* Public routes */
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
/* User routes */
app.use("/api/user", userRoutes);


connectDB().then(async () => {
  await initRoles();
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
