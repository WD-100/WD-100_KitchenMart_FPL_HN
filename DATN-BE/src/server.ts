import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";

import userRoutes from "./routes/user.route";

import adminUserRoutes from "./routes/admin/user.route";

import adminCategoriesRoutes from "./routes/admin/categories.route";

import adminRoleRoutes from "./routes/admin/role.route";
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
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/transaction", transactionRoutes);
/* Admin routes */
app.use("/api/admin/role", adminRoleRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/admin/user", adminUserRoutes);
app.use("/api/admin/feedback", adminFeedbackRoutes);
app.use("/api/admin/categories", adminCategoriesRoutes);
app.use("/api/admin/contacts", adminContactsRoutes);
app.use("/api/admin/order", adminOrderRoutes);
app.use("/api/admin/discount", adminDiscountRoutes);
app.use("/api/admin/transaction", adminTransactionRoutes);

connectDB().then(async () => {
  await initRoles();
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
