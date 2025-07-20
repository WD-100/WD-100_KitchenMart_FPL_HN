import express from "express";
import dotenv from "dotenv";

/* Start public routes */
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";
import categoriesRoutes from "./routes/categories.route";
import contactsRoutes from "./routes/contacts.route";
import uploadRoutes from "./routes/upload.route";
/* End public routes */
/* User routes */
import userRoutes from "./routes/user.route";
import cartRoutes from "./routes/cart.route";
import checkoutRoutes from "./routes/checkout.route";
import orderRoutes from "./routes/order.route";
import orderHistoryRoutes from "./routes/order_history.route";
import couponsRoutes from "./routes/coupon.route";
import myCouponRoutes from "./routes/my_coupon.route";
/* End user routes */
/* Start admin routes */
import adminProductRoutes from "./routes/admin/product.route";
import adminUserRoutes from "./routes/admin/user.route";
import adminCategoriesRoutes from "./routes/admin/categories.route";
import adminContactsRoutes from "./routes/admin/contacts.route";
import adminOrderRoutes from "./routes/admin/order.route";
import adminCouponRoutes from "./routes/admin/coupon.route";
import adminRoleRoutes from "./routes/admin/role.route";
import adminRevenueRoutes from "./routes/admin/revenue.route";
import adminHomeRoutes from "./routes/admin/home.route";
/* End admin routes */
import {connectDB} from "./config/db";
import cors from "cors";
import path from "path";
import {initRoles} from "./database/initRoles";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// enable cors
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* Start public routes */
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/upload", uploadRoutes);
/* End public routes */
/* Start user routes */
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/order-history", orderHistoryRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/my-coupons", myCouponRoutes);
/* End user routes */
/* Start admin routes */
app.use("/api/admin/role", adminRoleRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/admin/user", adminUserRoutes);
app.use("/api/admin/categories", adminCategoriesRoutes);
app.use("/api/admin/contacts", adminContactsRoutes);
app.use("/api/admin/order", adminOrderRoutes);
app.use("/api/admin/coupons", adminCouponRoutes);
app.use("/api/admin/revenue", adminRevenueRoutes);
app.use("/api/admin", adminHomeRoutes);
/* End admin routes */

connectDB().then(async () => {
    await initRoles();
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
