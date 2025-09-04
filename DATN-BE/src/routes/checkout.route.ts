import {Router} from "express";
import {checkout, checkout_vnpay, quickOrder, quickOrderVNPay} from "../controllers/checkout.controller";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", authenticateToken, checkout);

router.post("/quick-order", authenticateToken, quickOrder);

router.post("/quick-order-vnpay", authenticateToken, quickOrderVNPay);

router.post("/checkout_vnpay", authenticateToken, checkout_vnpay);

export default router;
