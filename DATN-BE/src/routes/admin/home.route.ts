import {Router} from "express";
import {authenticateToken} from "../../middlewares/auth.middleware";
import {chartOrders, dashboard, getBestSellingProducts} from "../../controllers/admin/home.controller";

const router = Router();

router.get('/dashboard', authenticateToken, dashboard);

router.get('/chart-orders', authenticateToken, chartOrders);

router.get('/best-selling', authenticateToken, getBestSellingProducts);

export default router;
